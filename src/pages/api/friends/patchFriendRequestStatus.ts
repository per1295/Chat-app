import type { NextApiHandler } from "next";
import type { FriendRequestStatusResponse } from "src/types/responses";

import { getRandomId } from "src/server/functions";
import { checkFields, objValuesUnitedWithNull } from "src/globalUtils/functions";
import { ExtendedHandler } from "src/server/constructors";

const handler: NextApiHandler<FriendRequestStatusResponse> = async (req, res) => {
    if ( checkFields(req.cookies), "id", "email", "password" ) {
        const { connection } = globalThis;
        const { id, idOfRequester, status } = req.body as FriendRequestStatusResponse;

        await connection.execute(
            `
                UPDATE friendRequests
                SET
                    status = :status
                WHERE
                    idOfResponser = :id
                    AND idOfRequester = :idOfRequester
            `,
            objValuesUnitedWithNull({ id, idOfRequester, status })
        );

        if ( status === "accepted" ) {
            const [ chats ] = await connection.execute(
                `
                    SELECT * FROM chats
                    WHERE
                        (
                            firstMember = :firstId AND secondMember = :secondId
                        )
                        OR
                        (
                            firstMember = :secondId AND secondMember = :firstId
                        )
                `,
                { firstId: id, secondId: idOfRequester }
            );

            if ( !chats.length ) {
                const chatId = getRandomId();

                await connection.execute(
                    `
                        INSERT INTO chats
                        (id, firstMember, secondMember)
                        VALUES
                        (:id, :firstMember, :secondMember)
                    `,
                    {
                        id: chatId,
                        firstMember: id,
                        secondMember: idOfRequester
                    }
                );
            }
        }

        res.json({ id, idOfRequester, status });
    } else {
        throw new Error("You need to login first of all");
    }
}

const extendedHandler = new ExtendedHandler();

extendedHandler.methodPATCH(handler);

export default extendedHandler.getExtendedHandler();