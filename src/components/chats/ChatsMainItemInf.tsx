import style from "@styles/chats/ChatsMainItemInf.module.scss";

import type { FunctionComponent } from "react";
import type { Chat } from "src/types/chats";

import Icon from "@components/global/Icon";

import { useTypedSelector } from "src/utils/hooks";
import { useContext } from "react";
import { HeadingInputContext } from "src/utils/contexts";

const ChatsMainItemInf: FunctionComponent<Pick<Chat, "username" | "lastMessage">> =
({ username, lastMessage }) =>
{
    const userData = useTypedSelector<"userData">(state => state.userData);
    const { value } = useContext(HeadingInputContext);

    const mainClassNameIcon = lastMessage?.status === "read" ? style.chats_main_item_inf_bottom_icon_read : style.chats_main_item_inf_bottom_icon_sent;
    const isFriend = userData?.id !== lastMessage?.idOfSender;

    return(
        <div className={`h-100 d-flex flex-column align-items-start ${style.chats_main_item_inf}`}>
            <span className={`d-inline-block text-truncate ${style.chats_main_item_inf_nickname}`}>
                {
                    username
                    .split("")
                    .map((item, index) => value && value.includes(item.toLowerCase()) ? <span key={index} className={style.chats_main_item_inf_nickname_matched}>{item}</span> : <span key={index}>{item}</span>)
                }
            </span>
            {
                lastMessage?.status && lastMessage?.content
                ?
                <span className={`d-inline-block text-truncate ${style.chats_main_item_inf_bottom}`}>
                    { !isFriend ? <Icon className={`bi-check-circle ${style.chats_main_item_inf_bottom_icon} ${mainClassNameIcon}`} /> : null }
                    { lastMessage.content }
                </span>
                :
                null
            }
        </div>
    )
}

export default ChatsMainItemInf;