import style from "@styles/chats/chat/HeadingInfText.module.scss";

import { useChatData } from "src/utils/hooks";

export default function HeadingInfText() {
    const chatData = useChatData();

    const statusOfUser = chatData?.statusOfUser === "waiting"
    ?
    `${chatData.statusOfUser}...`
    :
    chatData?.statusOfUser;

    return(
        <div className={style.chat_heading_inf_text}>
            <span className={`d-block text-capitalize text-truncate ${style.chat_heading_inf_text_username}`}>
                {chatData?.username}
            </span>
            <span className={`d-block text-capitalize text-truncate ${statusOfUser === "offline" ? "text-muted" : ""} ${style.chat_heading_inf_text_status}`}>
                {statusOfUser}
            </span>
        </div>
    )
}