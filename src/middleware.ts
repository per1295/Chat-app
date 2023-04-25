import type { NextMiddleware } from "next/server";

import { middlewareWrapper, fromHomeToLogin } from "./server/middlewareUtils";

const middleware: NextMiddleware = req => {
    const returnedValue = middlewareWrapper(
        req,
        fromHomeToLogin
    );
    
    return returnedValue;
}

export default middleware;

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico).*)"
    ]
}