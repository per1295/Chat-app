import type { NextApiHandler } from "next";
import type { PatchReadUserMessageArg } from "src/types/redux";
import type { PatchReadUserMessageResponse } from "src/types/responses";

import { ExtendedHandler } from "src/server/constructors";

const handler: NextApiHandler<PatchReadUserMessageResponse> = async (req, res) => {
    const { idOfMessage } = req.body as Pick<PatchReadUserMessageArg, "idOfMessage">;
    const { connection } = globalThis;

    await connection.execute(
        `
            UPDATE messages
            SET
                status = "read"
            WHERE
                id = :idOfMessage
        `,
        { idOfMessage }
    );

    res.json({ idOfMessage, status: "read" });
}

const extendedHandler = new ExtendedHandler();

extendedHandler.methodPATCH(handler);

export default extendedHandler.getExtendedHandler();