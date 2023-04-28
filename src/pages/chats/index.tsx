import style from "@styles/chats/Chats.module.scss";

import Layout from "@components/chats/Layout";
import ChatsMain from "@components/chats/ChatsMain";
import GlobalLayout from "@components/global/GlobalLayout";
import ErrorComponent from "@components/global/ErrorComponent";

import type { NextPageWithLayout } from "src/types/global";
import type { ChatsData, LastMessage, LastMessageStatus, ChatServerVersion } from "src/types/chats";
import type { UserData } from "src/types/redux";
import type { UnitedWithErrorProps } from "src/types/functions";

import { getServerSidePropsWrapper } from "src/server/functions";
import { checkFields, normalizeBase64, deleteFromObj, getDateTime } from "src/globalUtils/functions";
import { useState, useEffect } from "react";
import { HeadingInputContext } from "src/utils/contexts";

export const getServerSideProps = getServerSidePropsWrapper<ChatsData>(
    async ({ req }) => {
        if ( checkFields(req.cookies, "id", "email", "password") ) {
            const { connection } = globalThis;
            const { id } = req.cookies as Pick<NonNullable<UserData>, "id">;
        
            let [ chats ] = await connection.execute(
                `
                    SELECT
                        chats.id,
                        (
                            SELECT
                                CASE
                                    WHEN users.name IS NOT NULL AND users.surname IS NOT NULL
                                    THEN CONCAT_WS(" ", users.name, users.surname)
                                    ELSE users.email
                                END
                            FROM users
                            WHERE
                                (
                                    chats.firstMember = users.id
                                    AND chats.firstMember != :id
                                )
                                OR
                                (
                                    chats.secondMember = users.id
                                    AND chats.secondMember != :id
                                )
                            LIMIT 1
                        ) AS username,
                        (
                            SELECT profileImage
                            FROM users
                            WHERE
                                (
                                    chats.firstMember = users.id
                                    AND chats.firstMember != :id
                                )
                                OR
                                (
                                    chats.secondMember = users.id
                                    AND chats.secondMember != :id
                                )
                            LIMIT 1
                        ) AS profileImage,
                        (
                            SELECT content
                            FROM messages
                            WHERE chats.id = messages.idOfChat
                            ORDER BY messages.birth DESC
                            LIMIT 1
                        ) AS content,
                        (
                            SELECT type
                            FROM messages
                            WHERE chats.id = messages.idOfChat
                            ORDER BY messages.birth DESC
                            LIMIT 1
                        ) AS type,
                        (
                            SELECT status
                            FROM messages
                            WHERE chats.id = messages.idOfChat
                            ORDER BY messages.birth DESC
                            LIMIT 1
                        ) AS status,
                        (
                            SELECT birth
                            FROM messages
                            WHERE chats.id = messages.idOfChat
                            ORDER BY messages.birth DESC
                            LIMIT 1
                        ) AS birth,
                        (
                            SELECT idOfSender
                            FROM messages
                            WHERE chats.id = messages.idOfChat
                            ORDER BY messages.birth DESC
                            LIMIT 1
                        ) AS idOfSender
                    FROM chats
                    WHERE
                        firstMember = :id
                        OR
                        secondMember = :id
                `,
                {
                    id
                }
            );
            
            if ( chats.length ) {
                chats = chats.map((chat: Partial<ChatServerVersion & LastMessage>) => {
                    if ( checkFields(chat, "content", "type", "status", "birth", "idOfSender") ) {
                        let content = "";

                        if ( chat.content ) {
                            switch(chat.type) {
                                case "text":
                                    content = chat.content.toString("utf-8");
                                    break;
                                case "audio":
                                case "file":
                                case "image":
                                    content = `The ${chat.type}`;
                                    break;
                            }
                        }

                        chat.lastMessage = {
                            content,
                            status: chat.status as LastMessageStatus,
                            birth: getDateTime(chat.birth),
                            idOfSender: chat.idOfSender as string
                        }
                    } else {
                        chat.lastMessage = null;
                    }

                    if ( chat.profileImage instanceof Buffer ) {
                        chat.profileImage = normalizeBase64(chat.profileImage.toString("base64"));
                    }
    
                    return deleteFromObj(chat, "content", "status", "birth", "idOfSender");
                });
            } else {
                chats = "There`s no chats for now. Add some friends.";
            }

            return {
                props: { chats }
            }
        } else {
            throw new Error("You need login first of all");
        }
    }
)

const Chats: NextPageWithLayout<UnitedWithErrorProps<ChatsData>> = ({ chats, errorName, errorMessage }) => {
    const [ headingInputValue, setHeadingInputValue ] = useState<string>("");
    
    useEffect(() => {
        const value = localStorage.getItem("chats-heading-input") ?? "";
        setHeadingInputValue(value);
    }, []);

    const contextValue = {
        value: headingInputValue,
        setValue: setHeadingInputValue
    };

    return(
        <div className={`vstack align-items-center ${style.chats}`}>
            <HeadingInputContext.Provider value={contextValue}>
                <Layout>
                    {
                        errorName && errorMessage
                        ?
                        <ErrorComponent errorName={errorName} errorMessage={errorMessage} />
                        :
                        <ChatsMain chats={chats} />
                    }
                </Layout>
            </HeadingInputContext.Provider>
        </div>
    )
}

Chats.getLayout = page => {
    return(
        <GlobalLayout>
            { page }
        </GlobalLayout>
    )
}

export default Chats;