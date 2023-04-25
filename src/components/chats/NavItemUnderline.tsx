import style from "@styles/chats/NavItemUnderline.module.scss";

import type { FunctionComponent } from "react";

interface NavItemUnderlineProps {
    isActive: boolean;
}

const NavItemUnderline: FunctionComponent<NavItemUnderlineProps> =
({ isActive }) =>
{
    const className = isActive ? style.chats_nav_underline : `${style.chats_nav_underline} ${style.chats_nav_underline_invisible}`

    return(
        <hr className={`m-0 border border-3 ${className}`} />
    )
}

export default NavItemUnderline;