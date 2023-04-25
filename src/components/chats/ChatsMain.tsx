import ChatsMainNone from "./ChatsMainNone";
import ChatsMainItem from "./ChatsMainItem";

import type { FunctionComponent } from "react";
import type { ChatsData } from "src/types/chats";

import { useContext } from "react";
import { HeadingInputContext } from "src/utils/contexts";

const ChatsMain: FunctionComponent<ChatsData> = ({ chats }) => {
    const { value } = useContext(HeadingInputContext);

    if ( chats instanceof Array ) {
        return(
            <>
                {
                    chats
                    .filter(chat => value ? chat.username.match( new RegExp(value, "i") ) : true)
                    .map((chat, index) => (
                        <ChatsMainItem key={`${chat.id}-${index}`} {...chat} />
                    ))
                }
            </>
        )
    }
    
    if ( typeof chats === "string" ) {
        return(
            <ChatsMainNone>
                { chats }
            </ChatsMainNone>
        )
    }

    return null;
}

export default ChatsMain;