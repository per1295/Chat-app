import style from "@styles/friends/FriendRequests.module.scss";

import type { FunctionComponent } from "react";
import type { FriendRequestsProps } from "src/types/friends";

import FriendRequestsRequest from "./FriendRequestsRequest";

const FriendRequests: FunctionComponent<FriendRequestsProps> = ({ requests }) => {
    return(
        <div className={`w-100 d-flex flex-column align-items-center mb-5 mb-md-0 ${style.friends_friendRequests}`}>
            {
                requests.map(item => (
                    <FriendRequestsRequest
                        key={item.id}
                        idOfRequester={item.idOfRequester}
                        username={item.username}
                        profileImage={item.profileImage}
                        status={item.status}
                    />
                ))
            }
        </div>
    )
}

export default FriendRequests;