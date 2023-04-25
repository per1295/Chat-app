import type { NextApiHandler } from "next";
import type { FriendRequestResponse } from "src/types/responses";
import type { FriendRequestArg } from "src/types/redux";

import { getRandomId } from "src/server/functions";
import { ExtendedHandler } from "src/server/constructors";

const handler: NextApiHandler<FriendRequestResponse> = async (req, res) => {
    const { idOfRequester, idOfResponser, status } = req.body as FriendRequestArg;

    const { connection } = globalThis;

    const [ requests ] = await connection.execute(
        `
            SELECT * FROM friendrequests
            WHERE idOfRequester = ? AND idOfResponser = ?
            LIMIT 1
        `,
        [ idOfRequester, idOfResponser ]
    );

    if ( requests.length ) {
        await connection.execute(
            `
                UPDATE friendrequests
                SET status = ?
                WHERE idOfRequester = ? AND idOfResponser = ?
            `,
            [ status, idOfRequester, idOfResponser ]
        );
    } else {
        const randomId = getRandomId();

        await connection.execute(
            `
                INSERT INTO friendrequests
                (id, idOfRequester, idOfResponser, status)
                VALUES
                (?, ?, ?, ?)
            `,
            [ randomId, idOfRequester, idOfResponser, status ]
        );
    }

    res.json({ idOfRequester, idOfResponser, status });
}

const extendedHandler = new ExtendedHandler();

extendedHandler.methodPUT(handler);

export default extendedHandler.getExtendedHandler();