import style from "@styles/chats/Nav.module.scss";

import NavItem from "./NavItem";
import NavItemCalls from "./NavItemCalls";

export default function Nav() {
    return(
        <nav className={`d-flex align-items-center justify-content-between mb-4 mb-lg-0 ${style.chats_nav}`}>
            <NavItem href="/chats">
                Chats
            </NavItem>
            <NavItem href="/friends">
                Friends
            </NavItem>
            <NavItemCalls />
        </nav>
    )
}