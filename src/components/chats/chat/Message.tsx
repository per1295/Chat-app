import style from "@styles/chats/chat/Message.module.scss";

import type { FunctionComponent, Dispatch, SetStateAction } from "react";
import type { ChatDataMessage } from "src/types/redux";

import { useTypedSelector } from "src/utils/hooks";
import { useEffect, useRef } from "react";

import MessageContent from "./MessageContent";
import MessageTime from "./MessageTime";

type MessageProps = Omit<ChatDataMessage, "idOfChat"> & {
    index: number;
    messagesCount: number;
    appearedMessagesCount: number | null;
    setAppearedMessagesCount: Dispatch<SetStateAction<number | null>>;
};

const Message: FunctionComponent<MessageProps> =
({
    id,
    content,
    birth,
    status,
    idOfSender,
    type,
    index,
    messagesCount,
    appearedMessagesCount,
    setAppearedMessagesCount
}) =>
{
    const userData = useTypedSelector<"userData">(state => state.userData);
    const messageRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const message = messageRef.current as HTMLDivElement;

        let timeout: NodeJS.Timeout;

        if (
            !(
                message.classList.contains(style.friend_message_appear)
                ||
                message.classList.contains(style.message_appear)
            )
        ) {
            let delay = ( messagesCount - (appearedMessagesCount ?? 0) - index ) * 250;

            if ( delay < 0 ) delay = 0;

            timeout = setTimeout(() => {
                message.classList.add(isFriend ? style.friend_message_appear : style.message_appear);

                setAppearedMessagesCount(appearedMessagesCount => {
                    return appearedMessagesCount ? appearedMessagesCount + 1 : 1;
                });
            }, delay);
        }

        return () => {
            if ( timeout ) clearTimeout(timeout);
        }
    }, [ messagesCount ]);

    const mainClassName = idOfSender === userData?.id
    ?
    "align-self-end align-items-end"
    :
    "align-self-start align-items-start";

    const isFriend = idOfSender !== userData?.id;

    return(
        <div
            ref={messageRef}
            className={`${mainClassName} d-flex flex-column ${style.chat_messages_message}`}
            data-is-friend={isFriend}
        >
            <MessageContent id={id} content={content} type={type} idOfSender={idOfSender} />
            <MessageTime birth={birth} status={status} idOfSender={idOfSender} />
        </div>
    )
}

export default Message;