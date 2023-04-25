import style from "@styles/chats/chat/MessageContent.module.scss";

import type { FunctionComponent } from "react";
import type { ChatDataMessage } from "src/types/redux";

import { useTypedSelector, useTypedDispatch } from "src/utils/hooks";
import { useEffect, useRef } from "react";
import { patchReadUserMessage } from "src/redux/chatData";
import { BLUR_DATA_URL } from "src/utils/constants";

import Image from "next/image";
import MessageContentFile from "./MessageContentFile";
import MessageContentAudio from "./MessageContentAudio";

const MessageContent: FunctionComponent<Omit<ChatDataMessage, "status" | "birth" | "idOfChat">> =
({ id, content, idOfSender, type }) =>
{
    const userData = useTypedSelector<"userData">(state => state.userData);
    const dispatch = useTypedDispatch();
    const messageContentRef = useRef<HTMLSpanElement>(null);

    const readFriendMessage = () => {
        const messageContent = messageContentRef.current as HTMLSpanElement;
        const { top, bottom } = messageContent.getBoundingClientRect();

        if ( top > 0 && bottom > 0 ) {
            dispatch(
                patchReadUserMessage({
                    idOfMessage: id,
                    idOfSender
                })
            );
        }
    }

    useEffect(() => {
        document.addEventListener("scroll", readFriendMessage);

        return () => {
            document.removeEventListener("scroll", readFriendMessage);
        }
    }, []);

    const mainClassName = idOfSender === userData?.id
    ?
    style.chat_messages_message_content
    :
    `${style.chat_messages_message_content} ${style.chat_messages_message_content_friend}`;

    return(
        <span ref={messageContentRef} className={`position-relative ${mainClassName}`} data-content-type={type}>
            {
                type === "text"
                ?
                content
                :
                type === "image"
                ?
                <Image
                    className={`w-100 h-100 ${style.chat_messages_message_content_image}`}
                    src={content}
                    alt="message_image"
                    width={100}
                    height={100}
                    blurDataURL={BLUR_DATA_URL}
                    placeholder="blur"
                />
                :
                type === "file"
                ?
                <MessageContentFile content={content} idOfSender={idOfSender} />
                :
                <MessageContentAudio content={content} idOfSender={idOfSender} />
            }
        </span>
    )
}

export default MessageContent;