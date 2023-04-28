import type { NextApiHandler } from "next";
import type { AddUserResponse } from "src/types/responses";

import { getRandomId, setCookies, bufferToString } from "src/server/functions";
import { objValuesTruthy, deleteFromObj, getDateTime } from "src/globalUtils/functions";
import { ExtendedHandler } from "src/server/constructors";

interface RequestBody {
    email: string;
    password: string;
}

const handler: NextApiHandler<AddUserResponse> = async (req, res) => {
    const { email, password } = req.body as RequestBody;
    const { connection } = globalThis;

    let userId: string;

    let [ users ] = await connection.execute(
        `
            SELECT
                id,
                email,
                password,
                profileImage,
                IF(
                    name IS NOT NULL AND surname IS NOT NULL,
                    CONCAT_WS(" ", name, surname),
                    NULL
                ) AS username
            FROM users
            WHERE
                email = :email
                AND password = :password
            LIMIT 1
        `,
        { email, password }
    );

    if ( users.length ) {
        const existUser = users[0];

        userId = existUser.id;

        await connection.execute(
            `
                UPDATE users
                SET
                    status = "online"
                WHERE
                    id = :userId
            `,
            { userId }
        );
        
        if ( existUser?.profileImage ) {
            existUser.profileImage = bufferToString("image", existUser.profileImage);
        }

        const responseBody = objValuesTruthy<AddUserResponse>(existUser);
        
        setCookies(
            res,
            deleteFromObj(
                responseBody,
                "profileImage"
            ),
            {
                path: "/",
                expires: new Date(Date.now() + 8.64e7)
            }
        );

        res.json(responseBody);
    } else {
        const [ userWithExistedEmail ] = await connection.execute(
            `
                SELECT * FROM users
                WHERE email = :email
            `,
            { email }
        );

        if ( userWithExistedEmail.length ) {
            throw new Error("Wrong password of email");
        }

        userId = getRandomId();
        const birth = getDateTime();

        await connection.execute(
            `
                INSERT INTO users
                (id, email, password, birth, status)
                VALUES
                (?, ?, ?, ?, "online")
            `,
            [ userId, email, password, birth ]
        );

        setCookies(
            res,
            {
                id: userId,
                email,
                password
            },
            {
                path: "/",
                expires: new Date(Date.now() + 8.64e7)
            }
        );

        res.json({
            id: userId,
            email,
            password
        });
    }
}

const extendedHandler = new ExtendedHandler();

extendedHandler.methodPOST(handler);

export default extendedHandler.getExtendedHandler();