import type { AddUsersDataUser, FriendRequestArg, UserData, ChatDataMessage, PatchReadUserMessageArg } from "./redux";
import type { FriendRequest } from "./friends";

export type AddUserResponse = Omit<NonNullable<UserData>, "status">;

export type GetUsersResponse = AddUsersDataUser[];

export interface FriendRequestResponse extends FriendRequestArg {
    status: AddUsersDataUser["status"];
}

export type PatchUserDataResponse = NonNullable<UserData>;

export type FriendRequestStatusResponse = Pick<FriendRequest, "id" | "idOfRequester" | "status">;

export type PostUserMessageResponse = ChatDataMessage;

export interface PatchReadUserMessageResponse extends Pick<PatchReadUserMessageArg, "idOfMessage"> {
    status: "read";
}