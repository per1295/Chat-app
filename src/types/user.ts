import type { ParsedUrlQuery } from "querystring";

export interface UserProps {
    user: UserData;
}

export interface UserData {
    id: string;
    email: string;
    username?: string;
    profileImage?: string;
}

export type UserDataServerVersion = UserData & {
    profileImage?: string | Buffer;
}

export interface UserParams extends ParsedUrlQuery {
    idOfUser: string;
}