import type { NextRequest } from "next/server";

import { NextResponse } from "next/server";

export function fromHomeToLogin(req: NextRequest) {
    if ( /^\/home$/i.test(req.nextUrl.pathname) && checkMiddlewareCookies(req, "id", "email", "password") ) {
        return NextResponse.redirect(
            new URL("/chats", req.nextUrl.origin)
        );
    }
}

export function checkMiddlewareCookies(req: NextRequest, ...fields: string[]): boolean {
    let result = true;

    for ( let i = 0; i < fields.length; i++ ) {
        if ( !req.cookies.has(fields[i]) || !req.cookies.get(fields[i]) ) {
            result = false;
            break;
        }
    }

    return result;
}

export function middlewareWrapper(req: NextRequest, ...subMiddlewares: ((req: NextRequest) => NextResponse | undefined)[]) {
    let returnedValue: NextResponse | undefined;

    for ( let i = 0; i < subMiddlewares.length; i++ ) {
        returnedValue = subMiddlewares[i](req);
        if ( returnedValue ) break;
    }

    return returnedValue;
}