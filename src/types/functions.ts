import type { Method } from "axios";
import type { NextApiHandler } from "next";

export interface CheckFormItemOpt {
    type: string;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
}

export type DateTimePart = number | string;

export interface CookieOptions {
    path?: string;
    domain?: string;
    expires?: Date | string;
    httpOnly?: boolean;
    maxAge?: number;
    sameSite?: "strict" | "lax" | "secure" | "none"
}

export interface AnyObject {
    [key: string]: any;
}

export interface ErrorProps {
    errorName: string;
    errorMessage: string;
}

export type UnitedWithErrorProps<PropsType> = PropsType & ErrorProps;

export type GetFormatedTimeOptions = Partial<{
    h: boolean;
    m: boolean;
    s: boolean;
}>;

export interface PatchChangeUserStatusBody {
    id: string;
    status: "online" | "offline";
}

export type BytesToFormat = "kb" | "mb" | "gb";

export interface LoadingProgressStateItem {
    id: string;
    status: "idle" | "loading";
}

export interface LoadingProgressServiceWorkerMessage {
    type: string;
    payload: LoadingProgressStateItem;
}

export type ExtendedHandlerHandlers = {
    [name in Lowercase<Method>]?: NextApiHandler;
};

export type BufferTypes = "text" | "audio" | "image" | "file";

export interface ConnectionStatusServiceWorkerMessagePayload {
    id: string;
    status: "online" | "offline";
}

export interface ConnectionStatusServiceWorkerMessage {
    type: string;
    payload: ConnectionStatusServiceWorkerMessagePayload;
}