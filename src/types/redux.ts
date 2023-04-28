import type { FriendRequest } from "./friends";
import type { BufferTypes } from "./functions";

export interface ReduxState {
    userData: UserData;
    addUsersData: AddUsersData;
    friendRequests: FriendRequests;
    chatData: ChatData;
    alerts: Alerts;
}

export interface AsyncState {
    status: "fulfilled" | "rejected" | "pending";
    statusMessage?: string;
}

export type AsyncData<Data = {}> = (Data & AsyncState) | null;

export type UserData = AsyncData<{
    id: string;
    email: string;
    password: string;
    username?: string;
    profileImage?: string;
}>

export type AddUsersData = AsyncData<{
    users: AddUsersDataUser[];
}>;

export interface AddUsersDataUser {
    id: string;
    username: string;
    status: "requested" | "accepted" | "denied" | "waiting" | "error" | "none";
}

export interface AddUsersDataArgument {
    "heading-input": string;
}

export type FriendRequests = AsyncData<{
    requests: FriendRequest[];
}>

export interface FriendRequestArg {
    idOfRequester: string;
    idOfResponser: string;
    status: AddUsersDataUser["status"];
}

export type ChatData = AsyncData<{
    idOfUser: string;
    username: string;
    statusOfUser: "online" | "offline" | "waiting";
    isAllMessages: boolean;
    messages: ChatDataMessage[];
    profileImage?: string;
}>

export interface ChatDataMessage {
    id: string;
    content: string;
    type: BufferTypes;
    status: "sent" | "read" | "error" | "none";
    birth: string | null;
    idOfSender: string;
    idOfChat: string;
}

export interface PostUserMessageArg {
    idOfChat: string;
    idOfSender: string;
    content: string;
    type: BufferTypes;
}

export interface PatchReadUserMessageArg {
    idOfSender: string;
    idOfMessage: string;
}

export type Alerts = Alert[];

export interface Alert {
    id: string;
    title: string;
    icon: "info" | "error";
}

export interface GetMessagesArg {
    lastMessageId?: string;
    latestMessageId?: string;
}

export interface GetMessagesQuery extends GetMessagesArg {
    idOfChat: string;
}