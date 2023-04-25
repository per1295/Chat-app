import type { NextApiHandler } from "next";
import type { ChatData, UserData } from "src/types/redux";

import { checkFields } from "src/globalUtils/functions";
import { ExtendedHandler } from "src/server/constructors";

const handler: NextApiHandler<NonNullable<ChatData>["statusOfUser"]> = async (req, res) => {
    if ( checkFields(req.cookies, "id", "email", "password") ) {
        const { id } = req.cookies as Pick<NonNullable<UserData>, "id">;
        const { idOfChat } = req.query;
        const { connection } = globalThis;

        const [ users ] = await connection.execute(
            `
                SELECT status AS statusOfUser
                FROM users
                WHERE
                    users.id = (
                        SELECT
                            IF(firstMember = :id, secondMember, firstMember)
                        FROM chats
                        WHERE chats.id = :idOfChat
                        LIMIT 1
                    )
            `,
            { id, idOfChat }
        );

        if ( users.length ) {
            const user = users[0], { statusOfUser } = user;
            
            res.send(statusOfUser);
        } else {
            throw new Error("This user doesn`t exist");
        }
    } else {
        throw new Error("You need login first of all");
    }
};

const extendedHandler = new ExtendedHandler();

extendedHandler.methodGET(handler);

export default extendedHandler.getExtendedHandler();