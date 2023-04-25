import style from "@styles/chats/chat/MessageTime.module.scss";

import type { FunctionComponent } from "react";
import type { ChatDataMessage } from "src/types/redux";

import Icon from "@components/global/Icon";

import { getFormatedTime } from "src/globalUtils/functions";
import { useTypedSelector } from "src/utils/hooks";

const MessageTime: FunctionComponent<Pick<ChatDataMessage, "birth" | "status" | "idOfSender">> =
({ birth, status, idOfSender }) =>
{
    const userData = useTypedSelector<"userData">(state => state.userData);

    const isFriend = idOfSender !== userData?.id;

    const iconClassName = `d-flex ${style.chat_messages_message_time_icon}`;
    const waitingIconClassName = `${iconClassName} ${style.chat_messages_message_time_icon_waiting}`;
    const sentIconClassName = `bi-check2-circle ${iconClassName} ${style.chat_messages_message_time_icon_sent}`;
    const readIconClassName = `bi-check2-circle ${iconClassName} ${style.chat_messages_message_time_icon_read}`;
    const errorIconClassName = `bi-plus ${iconClassName} ${style.chat_messages_message_time_icon_error}`;
    
    return(
        <span className={`d-flex align-items-center mt-2 ps-2 pe-2 py-1 ${style.chat_messages_message_time}`}>
            {
                birth
                ?
                getFormatedTime(birth, { h: true, m: true })
                :
                status === "error"
                ?
                <Icon className={`bi-three-dots ${errorIconClassName}`} />
                :
                <Icon className={`bi-three-dots ${waitingIconClassName}`} />
            }
            {
                isFriend || (status === "none" || status === "error" )
                ?
                null
                :
                <Icon 
                    className={
                        status === "sent"
                        ?
                        sentIconClassName
                        :
                        readIconClassName
                    }
                />
            }
        </span>
    )
}

export default MessageTime;