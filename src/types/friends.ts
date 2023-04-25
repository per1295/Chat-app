export interface FriendsProps {
    requests: FriendRequests;
}

export interface FriendRequestsProps {
    requests: NonNullable<FriendRequests>;
}

export type FriendRequests = FriendRequest[] | null;

export interface FriendRequest {
    id: string;
    idOfRequester: string;
    username: string;
    profileImage: string | null;
    status: "accepted" | "denied" | "requested";
}

export type ServerFriendRequest = FriendRequest & {
    profileImage: Uint8Array | null;
};