import NoMessages from "./NoMessages";
import Messages from "./Messages";

import { useChatData, useTypedDispatch } from "src/utils/hooks";
import { useEffect } from "react";
import { getStatusOfUser, getMessages } from "src/redux/chatData";
import store from "src/redux";

export default function Main() {
    const dispatch = useTypedDispatch();
    const chatData = useChatData();

    useEffect(() => {
        let timeout: NodeJS.Timeout;

        if ( chatData ) {
            const { messages } = chatData;
            const latestMessage = messages.at(-1);

            if ( latestMessage ) {
                const latestMessageId = latestMessage.id;

                timeout = setTimeout(async function tick() {
                    await dispatch( getMessages({ latestMessageId }) );
        
                    timeout = setTimeout(tick, 2500);
                }, 5000);
            }
        }

        return () => {
            if ( timeout ) clearTimeout(timeout);
        }
    }, [ chatData ]);

    useEffect(() => {
        let timeout = setTimeout(async function tick() {
            await dispatch( getStatusOfUser() );

            timeout = setTimeout(tick, 5000);
        }, 5000);

        return () => {
            clearTimeout(timeout);
        }
    }, []);

    useEffect(() => {
        scrollTo({
            top: document.body.scrollHeight,
            behavior: "smooth"
        });
    }, []);

    useEffect(() => {
        document.addEventListener("scroll", scrollMessages);

        return () => {
            document.removeEventListener("scroll", scrollMessages);
        }
    }, []);

    function scrollMessages() {
        const { chatData } = store.getState();
        let { top } = document.body.getBoundingClientRect();
        
        top = Math.floor(top);

        if ( chatData && !chatData.isAllMessages && top > -20 ) {
            const { messages } = chatData;
            const lastMessage = messages.at(0);

            if ( lastMessage ) {
                dispatch( getMessages({ lastMessageId: lastMessage.id }) );
            }
        }
    }

    if ( chatData && chatData.messages.length ) {
        return(
            <Messages
                messages={chatData.messages}
                status={chatData.status}
                isAllMessages={chatData.isAllMessages}
            />
        )
    }

    return <NoMessages />
}