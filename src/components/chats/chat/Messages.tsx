import style from "@styles/chats/chat/Messages.module.scss";

import type { FunctionComponent } from "react";
import type { ChatData, ChatDataMessage } from "src/types/redux";

import Message from "./Message";
import MessagesDate from "./MessagesDate";

import { getFormatedDate, getDateTime } from "src/globalUtils/functions";

const Messages: FunctionComponent<Pick<NonNullable<ChatData>, "messages">> = ({ messages }) => {
    function getMessagesWithDates() {
        const messagesWithDates: JSX.Element[] = [];
        const date = new Date();
        const dateTimeString = getDateTime(date);
        const dateStringClient = getFormatedDate(dateTimeString, {
            y: true,
            m: true,
            d: true
        });
        const dayClient = +getFormatedDate(dateStringClient, { d: true });

        let nowDayServer: number;
        
        messages.forEach(({ id, content, type, birth, status, idOfSender }, index) => {
            if ( birth ) {
                const dateStringServer = getFormatedDate(birth, {
                    y: true,
                    m: true,
                    d: true
                });
                const dayServer = +getFormatedDate(birth, { d: true });
                
                if ( dayServer !== nowDayServer ) {
                    if ( dayServer === dayClient ) {
                        messagesWithDates.push(
                            <MessagesDate key={index} date="Today" />
                        );
                        nowDayServer = dayServer;
                    } else if ( dayClient - dayServer === 1 ) {
                        messagesWithDates.push(
                            <MessagesDate key={index} date="Yesterday" />
                        );
                        nowDayServer = dayServer;
                    } else {
                        messagesWithDates.push(
                            <MessagesDate key={index} date={dateStringServer} />
                        );
                        nowDayServer = dayServer;
                    }
                }

                messagesWithDates.push(
                    <Message
                        key={id}
                        id={id}
                        content={content}
                        type={type}
                        birth={birth}
                        status={status}
                        idOfSender={idOfSender}
                    />
                );
            }
        });

        return messagesWithDates;
    }

    const messagesWithDates = getMessagesWithDates();
    
    return(
        <div className={`d-flex flex-column ${style.chat_messages}`}>
            {messagesWithDates}
        </div>
    )
}

export default Messages;