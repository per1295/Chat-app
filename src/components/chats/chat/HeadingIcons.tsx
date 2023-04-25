import style from "@styles/chats/chat/HeadingIcons.module.scss"

import Icon from "@components/global/Icon";

import { useTooltip } from "src/utils/hooks";
import { useId } from "react";

export default function HeadingIcons() {
    const id = useId();

    useTooltip({
        id: `${id}-1`
    });

    useTooltip({
        id: `${id}-2`
    });

    return(
        <div className={`d-flex align-items-center gap-4 ms-3 ${style.chat_heading_icons}`}>
            <Icon
                className={`bi-camera-video ${style.chat_heading_icons_icon}`}
                id={`${id}-1`}
                data-bs-toggle="tooltip"
                data-bs-placement="left" 
                title="Camera doesn`t work yet"
            />
            <Icon
                className={`bi-telephone ${style.chat_heading_icons_icon}`}
                id={`${id}-2`}
                data-bs-toggle="tooltip"
                data-bs-placement="left" 
                title="Calls don`t work yet"
            />
        </div>
    )
}