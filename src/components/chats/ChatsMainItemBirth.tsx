import style from "@styles/chats/ChatsMainItemBirth.module.scss";

import type { FunctionComponent } from "react";

import { getFormatedTime } from "src/globalUtils/functions";

interface ChatsMainItemBirthProps {
    children: string;
}

const ChatsMainItemBirth: FunctionComponent<ChatsMainItemBirthProps> =
({ children }) =>
{
    return(
        <span className={`position-absolute ${style.chats_main_item_birth}`}>
            {getFormatedTime(children, { h: true, m: true })}
        </span>
    )
}

export default ChatsMainItemBirth;