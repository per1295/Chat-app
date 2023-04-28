import type { Offcanvas } from "bootstrap"
import type { RefObject } from "react";
import type { ChatData } from "./redux";
import type { Dispatch, SetStateAction } from "react";

export type IOffcanvasContext = RefObject<Offcanvas> | null;

export type IChatDataContext = NonNullable<ChatData> | null;

export interface IHeadingInputContext {
    value: string;
    setValue: Dispatch<SetStateAction<string>>;
}