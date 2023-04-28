import type { FunctionComponent } from "react";
import type { ChatDataMessage } from "src/types/redux";

import Message from "./Message";
import MessagesDate from "./MessagesDate";

import { getDateTime, getFormatedDate } from "src/globalUtils/functions";
import { useState } from "react";

interface MessagesContentProps {
    messages: ChatDataMessage[];
}

const MessagesContent: FunctionComponent<MessagesContentProps> = ({ messages }) => {
    const [ appearedMessageCount, setAppearedMessageCount ] = useState<number | null>(null);

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
                            <MessagesDate key={`date-${index}`} date="Today" />
                        );
                        nowDayServer = dayServer;
                    } else if ( dayClient - dayServer === 1 ) {
                        messagesWithDates.push(
                            <MessagesDate key={`date-${index}`} date="Yesterday" />
                        );
                        nowDayServer = dayServer;
                    } else {
                        messagesWithDates.push(
                            <MessagesDate key={`date-${index}`} date={dateStringServer} />
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
                        index={index}
                        messagesCount={messages.length}
                        appearedMessagesCount={appearedMessageCount}
                        setAppearedMessagesCount={setAppearedMessageCount}
                    />
                );
            }
        });

        return messagesWithDates;
    }

    const messagesWithDates = getMessagesWithDates();

    return(
        <>
            {messagesWithDates}
        </>
    )
}

export default MessagesContent;