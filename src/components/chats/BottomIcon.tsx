import style from "@styles/chats/BottomIcon.module.scss";

import Icon from "@components/global/Icon";

import type { FunctionComponent } from "react";

import { useRouter } from "next/router";

interface BottomItemProps {
    className: string;
    href: string;
    isActive: boolean;
}

const BottomIcon: FunctionComponent<BottomItemProps> =
({ className, href, isActive }) =>
{
    const router = useRouter();

    const push = () => router.push(href);

    const activeClassName = isActive ? `${style.chats_bottom_item} ${style.chats_bottom_item_active}` : style.chats_bottom_item;

    return(
        <Icon className={`${className} ${activeClassName} `} onClick={push} role="link" />
    )
}

export default BottomIcon;