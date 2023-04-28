import style from "@styles/chats/chat/Messages.module.scss";

import type { FunctionComponent } from "react";
import type { ChatData } from "src/types/redux";

import Spinner from "@components/global/Spinner";
import MessagesContent from "./MessagesContent";
import GrayText from "@components/global/GrayText";

const Messages: FunctionComponent<Pick<NonNullable<ChatData>, "messages" | "status" | "isAllMessages">> =
({ messages, status, isAllMessages }) =>
{
    return(
        <div className={`d-flex flex-column ${style.chat_messages}`}>
            {
                status === "pending"
                ?
                <Spinner type="border" className={style.chat_messages_spinner} />
                :
                isAllMessages
                ?
                <GrayText>
                    The chat`s start
                </GrayText>
                :
                null
            }
            <MessagesContent messages={messages} />
        </div>
    )
}

export default Messages;