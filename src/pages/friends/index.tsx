import GlobalLayout from "@components/global/GlobalLayout";
import Heading from "@components/friends/Heading";
import FriendRequests from "@components/friends/FriendRequests";
import NoFriendRequests from "@components/friends/NoFriendRequests";

import type { NextPageWithLayout } from "src/types/global";
import type { FriendsProps, ServerFriendRequest } from "src/types/friends";

import { objValuesUnitedWithNull, normalizeBase64 } from "src/globalUtils/functions";
import { getServerSidePropsWrapper } from "src/server/functions";
import { useReduxWithServerData, useTypedSelector } from "src/utils/hooks";
import { setFriendRequests } from "src/redux/friendRequests";

export const getServerSideProps = getServerSidePropsWrapper<FriendsProps>(
    async ({ req }) => {
        const { connection } = globalThis;
        const { id, email, password } = req.cookies;
    
        let [ friendRequests ] = await connection.execute(
            `
                SELECT
                    friendRequests.id,
                    CASE
                        WHEN idOfRequester = :id
                        THEN idOfResponser
                        ELSE idOfRequester
                    END AS idOfFriend,
                    (
                        SELECT profileImage FROM users
                        WHERE
                            users.id = friendRequests.idOfRequester
                            AND
                            friendRequests.idOfResponser = :id
                            OR
                            users.id = friendRequests.idOfResponser
                            AND
                            friendRequests.idOfRequester = :id
                    ) AS profileImage,
                    friendRequests.status,
                    (
                        SELECT
                        CASE
                            WHEN users.name IS NOT NULL AND users.surname IS NOT NULL
                            THEN CONCAT_WS (" ", users.name, users.surname)
                            ELSE users.email
                        END
                        FROM users
                        WHERE
                            users.id = friendRequests.idOfRequester
                            AND
                            friendRequests.idOfResponser = :id
                            OR
                            users.id = friendRequests.idOfResponser
                            AND
                            friendRequests.idOfRequester = :id
                    ) AS username
                FROM friendRequests
                WHERE
                    (
                        friendRequests.idOfResponser = :id
                        OR
                        friendRequests.idOfRequester = :id
                    )
                    AND friendRequests.status != "none"
                    AND EXISTS (
                        SELECT * FROM users
                        WHERE id = :id
                        AND email = :email
                        AND password = :password
                        LIMIT 1
                    )
            `,
            objValuesUnitedWithNull({
                id,
                email,
                password
            })
        );
    
        friendRequests = friendRequests.map((friendRequest: ServerFriendRequest) => {
            if ( friendRequest.profileImage ) {
                const profileImage = normalizeBase64(Buffer.from(friendRequest.profileImage).toString("base64"));
    
                return {
                    ...friendRequest,
                    profileImage
                }
            } else {
                return friendRequest;
            }
        });
    
        return {
            props: {
                requests: friendRequests.length ? friendRequests : null
            }
        }
    }
)

const Friends: NextPageWithLayout<FriendsProps> = ({ requests }) => {
    useReduxWithServerData(setFriendRequests, requests ? { status: "fulfilled", requests } : requests);

    const friendRequests = useTypedSelector<"friendRequests">(state => state.friendRequests);
    const mainRequests = friendRequests?.requests ?? requests;

    return(
        <div className="d-flex flex-column align-items-center friends">
            <Heading />
            {
                mainRequests
                ?
                <FriendRequests requests={mainRequests} />
                :
                <NoFriendRequests />
            }
        </div>
    )
}

Friends.getLayout = (page) => {
    return(
        <GlobalLayout>
            {page}
        </GlobalLayout>
    )
}

export default Friends;