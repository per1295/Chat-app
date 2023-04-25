import type { NextApiHandler } from "next";
import type { GetUsersResponse } from "src/types/responses";
import type { AnyObject } from "src/types/functions";

import { checkFields } from "src/globalUtils/functions";
import { ExtendedHandler } from "src/server/constructors";

interface GetUsersQuery extends Partial<AnyObject> {
    id: string;
    email: string;
    password: string;
    "heading-input": string;
}

const handler: NextApiHandler<GetUsersResponse> = async (req, res) => {
    if ( checkFields(req.query, "id", "email", "password", "heading-input") ) {
        const { connection } = globalThis;
        const { id, email, password, "heading-input": headingInput } = req.query as GetUsersQuery;

        const [ users ] = await connection.execute(
            `
                SELECT * FROM users
                WHERE id = ? and email = ? and password = ?
                LIMIT 1
            `,
            [ id, email, password ]
        );

        if ( !users.length ) throw new Error("Your account doesn`t exist. Login first of all.");

        let [ addUsers ] = await connection.execute(
            `
                SELECT users.id,
                CASE
                    WHEN users.name IS NOT NULL AND users.surname IS NOT NULL
                    THEN CONCAT_WS(" ", users.name, users.surname)
                    ELSE users.email
                END AS username,
                (
                    SELECT status FROM friendRequests
                    WHERE
                        (
                            friendRequests.idOfRequester = :id
                            AND friendRequests.idOfResponser = users.id
                            AND users.id != :id
                        )
                        OR
                        (
                            friendRequests.idOfResponser = :id
                            AND friendRequests.idOfRequester = users.id
                            AND users.id != :id
                        )
                    LIMIT 1
                ) AS status
                FROM users
                WHERE
                    (
                        LOCATE(:input, CONCAT_WS(" ", name, surname)) != 0
                        OR LOCATE(:input, email)
                    )
                    AND
                    users.id != :id
            `,
            { id, input: headingInput }
        ) as [ GetUsersResponse ];

        if ( !addUsers.length ) throw new Error("Users with this nickname or email doesn`t exist");

        addUsers = addUsers.map(addUser => ({ ...addUser, status: addUser.status ?? "none" }));

        res.json(addUsers);
    } else {
        throw new Error("Wrong account data. Login firs of all");
    }
}

const extendedHandler = new ExtendedHandler();

extendedHandler.methodGET(handler);

export default extendedHandler.getExtendedHandler();