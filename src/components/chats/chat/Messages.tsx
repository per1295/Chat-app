import style from "@styles/chats/chat/Messages.module.scss";

import type { FunctionComponent } from "react";
import type { ChatData } from "src/types/redux";

import Message from "./Message";

const Messages: FunctionComponent<Pick<NonNullable<ChatData>, "messages">> = ({ messages }) => {    
    return(
        <div className={`d-flex flex-column ${style.chat_messages}`}>
            {
                messages.map(({ id, content, type, birth, status, idOfSender }) => (
                    <Message key={id} id={id} content={content} type={type} birth={birth} status={status} idOfSender={idOfSender} />
                ))
            }
        </div>
    )
}

export default Messages;