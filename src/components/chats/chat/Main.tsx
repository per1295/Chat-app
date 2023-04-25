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
        let timeout = setTimeout(async function tick() {
            await dispatch( getStatusOfUser() );

            timeout = setTimeout(tick, 5000);
        }, 5000);

        return () => {
            clearTimeout(timeout);
        }
    }, []);

    useEffect(() => {
        scroll({
            top: document.body.scrollHeight,
            behavior: "smooth"
        });
    }, []);

    function scrollMessages() {
        const { chatData } = store.getState();
        let { top } = document.body.getBoundingClientRect();
        
        top = Math.floor(top);

        if ( chatData && top > -20 ) {
            const { messages } = chatData;
            const lastMessage = messages.at(0);

            if ( lastMessage ) {
                dispatch( getMessages({ lastMessageId: lastMessage.id }) );
            }
        }
    }

    useEffect(() => {
        document.addEventListener("scroll", scrollMessages);

        return () => {
            document.removeEventListener("scroll", scrollMessages);
        }
    }, []);

    return chatData?.messages.length ? <Messages messages={chatData.messages} /> : <NoMessages />
}