import type { ChatDataMessage } from "./redux";

export interface ChatsData {
    chats: Chat[] | null | string;
}

export interface Chat {
    id: string;
    username: string;
    profileImage: string | null;
    lastMessage: LastMessage | null;
}

export type ChatServerVersion = Omit<Chat, "profileImage" | "birth"> & {
    profileImage: Buffer | string;
    birth: Date;
    content: Buffer;
    type: ChatDataMessage["type"];
};

export interface LastMessage {
    content: string;
    status: LastMessageStatus;
    birth: string;
    idOfSender: string;
}

export type LastMessageStatus = "sent" | "read" | "other";