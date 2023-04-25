import style from "@styles/chats/chat/Heading.module.scss";

import Icon from "@components/global/Icon";
import HeadingInf from "./HeadingInf";
import HeadingIcons from "./HeadingIcons";

import { useRouter } from "next/router";
import { useOffcanvas, useHideableOffcanvas } from "src/utils/hooks";
import { useId } from "react";

export default function Heading() {
    const id = useId();

    const router = useRouter();
    const offcanvasRef = useOffcanvas({
        id,
        backdrop: false,
        scroll: true
    });

    useHideableOffcanvas(offcanvasRef);

    const onClick = () => router.back();

    return(
        <div
            className={`offcanvas offcanvas-top show d-flex flex-row align-items-center justify-content-between px-3 py-4 ${style.chat_heading}`}
            id={id}
            tabIndex={-1}
        >
            <Icon className={`bi-arrow-left d-flex align-self-start ${style.chat_heading_arrow}`} onClick={onClick} />
            <HeadingInf />
            <HeadingIcons />
        </div>          
    )
}