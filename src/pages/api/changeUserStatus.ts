import type { NextApiHandler } from "next";
import type { PatchChangeUserStatusBody } from "src/types/functions";

import { ExtendedHandler } from "src/server/constructors";

const handler: NextApiHandler<string> = async (req, res) => {
    const { id, status } = req.body as PatchChangeUserStatusBody;
    const { connection } = globalThis;

    await connection.execute(
        `
            UPDATE users
            SET
                status = :status
            WHERE
                id = :id
        `,
        { id, status }
    );

    res.send(status);
}

const extendedHandler = new ExtendedHandler();

extendedHandler.methodPATCH(handler);

export default extendedHandler.getExtendedHandler();