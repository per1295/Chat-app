import type { NextApiHandler } from "next";
import type { PostUserMessageResponse } from "src/types/responses";
import type { ChatDataMessage, PostUserMessageArg, GetMessagesQuery } from "src/types/redux";

import { getRandomId, stringToBuffer, bufferToString } from "src/server/functions";
import { ExtendedHandler } from "src/server/constructors";
import { getDateTime } from "src/globalUtils/functions";

const getHandler: NextApiHandler<ChatDataMessage[]> = async (req, res) => {
    const { idOfChat, lastMessageId } = req.query as Partial<GetMessagesQuery>;
    const { connection } = globalThis;

    let [ messages ] = await connection.execute(
        `
            SELECT * FROM messages
            WHERE
                idOfChat = :idOfChat
                AND
                id != :lastMessageId
                AND
                UNIX_TIMESTAMP(birth) <= UNIX_TIMESTAMP(
                    (
                        SELECT birth FROM messages
                        WHERE id = :lastMessageId
                        LIMIT 1
                    )
                )
            ORDER BY birth DESC
            LIMIT 5
        `,
        { idOfChat, lastMessageId }
    );

    messages = messages.reverse().map((message: any) => {
        message.content = bufferToString(message.type, message.content);
        return message;
    });

    res.json(messages);
}

const postHandler: NextApiHandler<PostUserMessageResponse> = async (req, res) => {
    const { idOfChat, idOfSender, content, type } = req.body as PostUserMessageArg;
    const { connection } = globalThis;

    const idOfMessage = getRandomId(), birth = getDateTime(), status = "sent";

    let parsedContent: Buffer | string = stringToBuffer(type, content);

    const responseBody = {
        id: idOfMessage,
        content: parsedContent as Buffer | string,
        type,
        birth,
        status,
        idOfSender,
        idOfChat
    } as ChatDataMessage;

    await connection.execute(
        `
            INSERT INTO messages
                (id, content, type, birth, status, idOfSender, idOfChat)
            VALUES
                (:id, :content, :type, :birth, :status, :idOfSender, :idOfChat)
        `,
        responseBody
    );
    
    responseBody.content = content;

    res.json(responseBody);
}

const extendedHandler = new ExtendedHandler();

extendedHandler.methodGET(getHandler).methodPOST(postHandler);

export default extendedHandler.getExtendedHandler();