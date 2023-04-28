import style from "@styles/friends/FriendRequestsRequestButtons.module.scss";

import type { FunctionComponent } from "react";
import type { FriendRequest } from "src/types/friends";

import Button from "@components/global/Button";
import Spinner from "@components/global/Spinner";

import { useTypedSelector, useTypedDispatch } from "src/utils/hooks";
import { patchFriendRequestStatus } from "src/redux/friendRequests";
import { useState } from "react";

interface FriendRequestsRequestButtonsProps {
    status: FriendRequest["status"];
    idOfFriend: string;
}

const FriendRequestsRequestButtons: FunctionComponent<FriendRequestsRequestButtonsProps> =
({ status, idOfFriend }) =>
{
    const userData = useTypedSelector<"userData">(state => state.userData);
    const friendRequests = useTypedSelector<"friendRequests">(state => state.friendRequests);
    const dispatch = useTypedDispatch();
    const [ whatButtonIsPending, setwhatButtonIsPending ] = useState<"accept" | "deny" | null>(null);

    const accept = async () => {
        if ( userData?.id ) {
            setwhatButtonIsPending("accept");

            await dispatch(
                patchFriendRequestStatus({
                    id: userData.id,
                    status: "accepted",
                    idOfFriend
                })
            )
            .unwrap();
        }
    }

    const deny = async () => {
        if ( userData?.id ) {
            setwhatButtonIsPending("deny");

            await dispatch(
                patchFriendRequestStatus({
                    id: userData.id,
                    status: "denied",
                    idOfFriend
                })
            )
            .unwrap();
        }
    }

    const acceptButtonText =
    status === "accepted"
    ?
    "Accepted"
    :
    status === "denied"
    ?
    "Add"
    :
    "Accept";

    const denyButtonText = status === "denied"
    ?
    "Denied"
    :
    status === "accepted"
    ?
    "Remove"
    :
    "Deny";

    return(
        <div className={`position-relative d-flex flex-wrap align-items-center justify-content-center gap-3 ${style.friends_requests_request_main_buttons}`}>
            <Button
                type="button"
                className={`btn btn-sm d-flex align-items-center gap-1 ${style.friends_requests_request_main_buttons_accept}`}
                onClick={accept}
                disabled={status === "accepted"}
            >
                {
                    friendRequests?.status === "pending" && whatButtonIsPending === "accept"
                    ?
                    <Spinner
                        className={style.friends_requests_request_main_buttons_spinner}
                        type="border"
                        size="sm"
                    />
                    :
                    null
                }
                { acceptButtonText }
            </Button>
            <Button
                type="button"
                className={`btn btn-sm d-flex align-items-center gap-1 ${style.friends_requests_request_main_buttons_deny}`}
                onClick={deny}
                disabled={status === "denied"}
            >
                {
                    friendRequests?.status === "pending" && whatButtonIsPending === "deny"
                    ?
                    <Spinner
                        className={style.friends_requests_request_main_buttons_spinner}
                        type="border"
                        size="sm"
                    />
                    :
                    null
                }
                { denyButtonText }
            </Button>
        </div>
    )
}

export default FriendRequestsRequestButtons;