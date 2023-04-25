import style from "@styles/chats/chat/Message.module.scss";

import type { FunctionComponent } from "react";
import type { ChatDataMessage } from "src/types/redux";

import { useTypedSelector } from "src/utils/hooks";

import MessageContent from "./MessageContent";
import MessageTime from "./MessageTime";

const Message: FunctionComponent<Omit<ChatDataMessage, "idOfChat">> =
({ id, content, birth, status, idOfSender, type }) =>
{
    const userData = useTypedSelector<"userData">(state => state.userData);

    const mainClassName = idOfSender === userData?.id
    ?
    "align-self-end align-items-end"
    :
    "align-self-start align-items-start";

    const isFriend = idOfSender !== userData?.id;

    return(
        <div
            className={`${mainClassName} d-flex flex-column ${style.chat_messages_message}`}
            data-is-friend={isFriend}
        >
            <MessageContent id={id} content={content} type={type} idOfSender={idOfSender} />
            <MessageTime birth={birth} status={status} idOfSender={idOfSender} />
        </div>
    )
}

export default Message;