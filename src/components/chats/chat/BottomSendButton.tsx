import style from "@styles/chats/chat/BottomSendButton.module.scss";

import Button from "@components/global/Button";
import Icon from "@components/global/Icon";

export default function BottomSendButton() {
    return(
        <Button type="submit" className={`border-0 p-0 ${style.chat_bottom_sendButton}`}>
            <Icon className={`bi-arrow-right-circle-fill d-flex ${style.chat_bottom_sendButton_icon}`} />
        </Button>
    )
}