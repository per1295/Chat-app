import style from "@styles/chats/SearchInput.module.scss";

import { useRef, useEffect, useContext } from "react";
import { HeadingInputContext } from "src/utils/contexts";

import type { FormEventHandler } from "react";

export default function SearchInput() {
    const inputRef = useRef<HTMLInputElement>(null);
    const { setValue } = useContext(HeadingInputContext);

    useEffect(() => {
        const input = inputRef.current;

        if ( input ) {
            input.value = localStorage.getItem("chats-heading-input") ?? "";
        }
    }, []);

    const onClick = () => {
        const input = inputRef.current as HTMLInputElement;
        input.focus();
    }

    const onInput: FormEventHandler<HTMLInputElement> = event => {
        const input = event.currentTarget;
        const inputValue = input.value.toLowerCase();
        setValue(inputValue);
        localStorage.setItem("chats-heading-input", inputValue);
    }

    return(
        <div className={`d-flex align-items-center rounded-pill ${style.chats_search_searchInput}`} onClick={onClick}>
            <i className={`bi bi-search ${style.chats_search_searchInput_icon}`}></i>
            <input
                ref={inputRef}
                className={`border-0 py-0 px-0 overflow-hidden text-truncate ${style.chats_search_searchInput_input}`}
                type="text"
                name="search-chat"
                id="search-chat"
                placeholder="Search Chat"
                autoComplete="off"
                onInput={onInput}
            />
        </div>
    )
}