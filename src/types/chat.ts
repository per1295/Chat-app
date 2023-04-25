import type { ParsedUrlQuery } from "querystring";
import type { ChatData, UserData, ChatDataMessage } from "./redux";

export interface ChatGetServerSidePropsParams extends ParsedUrlQuery {
    idOfChat: string;
}

export interface GetServerSideProps {
    chatData: ChatDataFromServer;
}

export type ChatDataFromServer = Omit<NonNullable<ChatData>, "status" | "statusMessage">;

export type ChatGetServerSidePropsCookies = Pick<NonNullable<UserData>, "id" | "email" | "password">;

export interface ChatMessageFromServer {
    type: ChatDataMessage["type"];
    content: Buffer | ChatDataMessage["content"];
    birth: Date | NonNullable<ChatDataMessage["birth"]>;
}

export interface ChatModal {
    type: Exclude<ChatDataMessage["type"], "text">;
    title: string;
    buttonContent: string;
    body: JSX.Element | JSX.Element[];
    data?: Blob;
}

export interface SendImage {
    [name: string]: File;
}