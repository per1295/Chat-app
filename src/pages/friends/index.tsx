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
                    friendRequests.idOfRequester,
                    users.profileImage,
                    friendRequests.status,
                    CASE
                        WHEN users.name IS NOT NULL AND users.surname IS NOT NULL
                        THEN CONCAT_WS (" ", users.name, users.surname)
                        ELSE users.email
                    END AS username
                FROM friendRequests, users
                WHERE
                    friendRequests.idOfResponser = :idOfResponser
                    AND friendRequests.idOfRequester = users.id
                    AND friendRequests.status != "none"
                    AND EXISTS (
                        SELECT * FROM users
                        WHERE id = :idOfResponser
                        AND email = :email
                        AND password = :password
                        LIMIT 1
                    )
            `,
            objValuesUnitedWithNull({
                idOfResponser: id,
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