import { setCookies } from "src/server/functions";
import { checkFields, objValuesUnitedWithNull, objValuesTruthy, deleteFromObj, getObjClone } from "src/globalUtils/functions";
import { ExtendedHandler } from "src/server/constructors";

import type { NextApiHandler } from "next";
import type { PatchUserDataResponse } from "src/types/responses";
import type { UserData } from "src/types/redux";

const handler: NextApiHandler<PatchUserDataResponse> = async (req, res) => {
    const body = req.body as NonNullable<UserData>;

    if ( checkFields(body, "id", "email", "password") ) {
        const { connection } = globalThis;

        let name, surname: string | null = null;
        let profileImage: Buffer | null = null;
        
        if ( body?.username ) {
            [ name, surname ] = body.username.split(" ");
        }

        if ( body?.profileImage ) {
            profileImage = Buffer.from(body.profileImage, "base64");
        }
        
        const updatedUserData = {
            id: body?.id,
            email: body?.email,
            password: body?.password,
            profileImage,
            name,
            surname,
            username: name && surname ? `${name} ${surname}` : null
        };

        await connection.execute(
            `
                UPDATE users
                SET
                    email = :email,
                    password = :password,
                    name = :name,
                    surname = :surname,
                    profileImage = :profileImage
                WHERE id = :id
            `,
            objValuesUnitedWithNull(updatedUserData)
        );

        setCookies(
            res,
            deleteFromObj(
                objValuesTruthy(updatedUserData),
                "profileImage", "name", "surname"
            ),
            {
                path: "/",
                expires: new Date(Date.now() + 8.64e7)
            }
        );

        res.json(body);
    } else {
        throw new Error("Required fields email and password aren`t correct.")
    }
}

const extendedHandler = new ExtendedHandler();

extendedHandler.methodPATCH(handler);

export default extendedHandler.getExtendedHandler();