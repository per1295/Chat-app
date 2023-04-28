import Heading from "@components/chats/chat/Heading";
import ErrorComponent from "@components/global/ErrorComponent";
import Bottom from "@components/chats/chat/Bottom";
import Main from "@components/chats/chat/Main";

import { getServerSidePropsWrapper } from "src/server/functions";
import { checkFields, normalizeBase64, getDateTime } from "src/globalUtils/functions";
import { useReduxWithServerData } from "src/utils/hooks";
import { setChatData, resetChatData } from "src/redux/chatData";
import { ChatDataContext } from "src/utils/contexts";
import { bufferToString } from "src/server/functions";

import type { FunctionComponent } from "react";
import type { UnitedWithErrorProps } from "src/types/functions";
import type { GetServerSideProps, ChatGetServerSidePropsParams, ChatDataFromServer, ChatGetServerSidePropsCookies, ChatMessageFromServer } from "src/types/chat";
import type { ChatData } from "src/types/redux";

export const getServerSideProps = getServerSidePropsWrapper<GetServerSideProps>(
    async ({ params, req }) => {
        const { idOfChat } = params as ChatGetServerSidePropsParams;
        const { connection } = globalThis;

        if ( !checkFields(req.cookies, "id", "email", "password") ) {
            throw new Error("You need login first of all");
        }

        const [ chats ] = await connection.execute(
            `
                SELECT firstMember, secondMember FROM chats
                WHERE id = :idOfChat
            `,
            { idOfChat }
        );

        if ( chats.length ) {
            const { firstMember, secondMember } = chats[0];
            const { id } = req.cookies as ChatGetServerSidePropsCookies;

            const [ users ] = await connection.execute(
                `
                    SELECT
                        id AS idOfUser,
                        CASE
                            WHEN name IS NOT NULL AND surname IS NOT NULL
                            THEN CONCAT_WS(" ", name, surname)
                            ELSE email
                        END AS username,
                        status AS statusOfUser,
                        profileImage
                    FROM users
                    WHERE
                        (
                            id = :firstMember AND id != :id
                        )
                        OR
                        (
                            id = :secondMember AND id != :id
                        )
                    LIMIT 1
                `,
                { firstMember, secondMember, id }
            );
    
            if ( users.length ) {
                const user = users[0];

                if ( user?.profileImage ) {
                    user.profileImage = normalizeBase64(user.profileImage.toString("base64"));
                }
    
                let [ messages ] = await connection.execute(
                    `
                        SELECT * FROM messages
                        WHERE idOfChat = :idOfChat
                        ORDER BY birth DESC
                        LIMIT 5
                    `,
                    { idOfChat }
                );

                messages = messages
                .reverse()
                .map((message: any) => {
                    message.birth = getDateTime(message.birth);
                    message.content = bufferToString(message.type, message.content as Buffer);
                    return message;
                });
    
                const chatData = { messages, ...user } as ChatDataFromServer;
                
                return {
                    props: {
                        chatData
                    }
                }
            } else {
                throw new Error("Your friend`s id doesn`t exist.");
            }
        } else {
            throw new Error(`The chat with ${idOfChat} id does not exist.`);
        }
    }
)

const Chat: FunctionComponent<UnitedWithErrorProps<GetServerSideProps>> = ({ chatData, errorName, errorMessage }) => {
    const contextValue = {
        ...chatData,
        status: "fulfilled",
        isAllMessages: !chatData?.messages.length
    } as NonNullable<ChatData>;

    useReduxWithServerData(setChatData, contextValue, resetChatData);

    if ( errorName && errorMessage ) {
        return(
            <ErrorComponent errorName={errorName} errorMessage={errorMessage} />
        )
    } else {
        return(
            <ChatDataContext.Provider value={contextValue}>
                <Heading />
                <Main />
                <Bottom />
            </ChatDataContext.Provider>
        )
    }
}

export default Chat;