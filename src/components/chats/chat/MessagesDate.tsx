import style from "@styles/chats/chat/MessagesDate.module.scss";

import type { FunctionComponent } from "react";

import MessagesDateLine from "./MessagesDateLine";

interface MessagesDateProps {
    date: string;
}

const MessagesDate: FunctionComponent<MessagesDateProps> = ({ date }) => {
    return(
        <div className="d-flex align-items-center justify-content-center gap-2 messagesDate">
            <MessagesDateLine />
            <div className={`text-truncate ${style.messagesDate_date}`}>
                {date}
            </div>
            <MessagesDateLine />
        </div>
    )
}

export default MessagesDate;