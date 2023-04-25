import style from "@styles/chats/chat/Bottom.module.scss";

import BottomTextarea from "./BottomTextarea";
import BottomIcons from "./BottomIcons";
import BottomSendButton from "./BottomSendButton";

import { useOffcanvas, useHideableOffcanvas, useTypedDispatch, useTypedSelector } from "src/utils/hooks";
import { useId } from "react";
import { postMessages } from "src/redux/chatData";
import { getChatsId } from "src/utils/functions";

import type { FormEventHandler } from "react";

export default function Bottom() {
    const userData = useTypedSelector<"userData">(state => state.userData);
    const dispatch = useTypedDispatch();

    const id = useId();
    const offcanvasRef = useOffcanvas({
        id,
        backdrop: false,
        scroll: true
    });

    useHideableOffcanvas(offcanvasRef);

    const onSubmit: FormEventHandler<HTMLFormElement> = event => {
        event.preventDefault();

        const form = event.currentTarget;
        const textarea = form.firstElementChild as HTMLTextAreaElement;
        const idOfChat = getChatsId();

        if ( userData?.id && idOfChat ) {
            dispatch(
                postMessages({
                    idOfChat,
                    idOfSender: userData.id,
                    content: textarea.value,
                    type: "text"
                })
            );

            textarea.value = "";
        }
    }

    return(
        <form
            className={`offcanvas offcanvas-bottom show d-flex flex-row align-items-center gap-4 gap-md-5 ps-5 pe-3 ${style.chat_bottom}`}
            id={id}
            tabIndex={-1}
            onSubmit={onSubmit}
        >
            <BottomTextarea />
            <BottomIcons />
            <BottomSendButton />
        </form>
    )
}