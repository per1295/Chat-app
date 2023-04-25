import style from "@styles/chats/chat/BottomTextarea.module.scss";

import { useId } from "react"

import type { KeyboardEventHandler } from "react";

export default function BottomTextarea() {
    const id = useId();

    const onKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = event => {
        if ( event.key.toLowerCase() === "enter" ) {
            event.preventDefault();

            const textarea = event.currentTarget;
            const form = textarea.closest("form");

            if ( form ) {
                const submitButton = form.querySelector<HTMLButtonElement>("button[type=submit]");
                if ( submitButton ) submitButton.click();
            }
        }
    }

    return(
        <textarea
            className={`form-control w-75 text-start align-middle p-0 ${style.chat_bottom_textarea}`}
            name="message"
            id={id}
            placeholder="Type here..."
            onKeyDown={onKeyDown}
        />
    )
}