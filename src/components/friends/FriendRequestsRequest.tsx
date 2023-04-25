import style from "@styles/friends/FriendRequestsRequest.module.scss";

import type { FunctionComponent } from "react";
import type { FriendRequest } from "src/types/friends";

import Link from "next/link";
import Image from "next/image";
import Icon from "@components/global/Icon";
import FriendRequestsRequestButtons from "./FriendRequestsRequestButtons";

const FriendRequestsRequest: FunctionComponent<Omit<FriendRequest, "id">> =
({ idOfRequester, username, status, profileImage }) =>
{
    return(
        <div className={`position-relative d-flex flex-wrap align-items-center justify-content-evenly gap-3 px-2 py-3 ${style.friends_friendRequests_request}`}>
            {
                profileImage
                ?
                <Image className={`mw-100 rounded-circle border-2 ${style.friends_friendRequests_request_profileImage}`} src={profileImage} alt="profile_image" width={100} height={100} />
                :
                <Icon className={`bi-person-fill ${style.friends_friendRequests_request_icon}`} />
            }
            <div className={`mw-100 d-flex flex-wrap align-items-center justify-content-center gap-3 ${style.friends_friendRequests_request_main}`}>
                <span className={`mw-100 d-inline-block text-truncate text-center ${style.friends_friendRequests_request_main_username}`}>{username}</span>
                <FriendRequestsRequestButtons status={status} idOfRequester={idOfRequester} />
            </div>
            <Link className="position-absolute top-0 start-0 h-100 w-100" href={`/users/${idOfRequester}`} />
        </div>
    )
}

export default FriendRequestsRequest;