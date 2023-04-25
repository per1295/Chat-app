import style from "@styles/chats/NavItem.module.scss";

import Link from "next/link";
import NavItemUnderline from "./NavItemUnderline";

import { useRouter } from "next/router";

import type { FunctionComponent } from "react";

interface NavItemProps {
    children: JSX.Element | string;
    href: string | URL;
    className?: string;
}

const NavItem: FunctionComponent<NavItemProps> =
({ children, href, className }) =>
{
    const router = useRouter();

    const isActive = (new RegExp(`${href}`, "i")).test(router.pathname);
    const mainClassName = isActive ? `${style.chats_nav_item} ${style.chats_nav_item_active}` : style.chats_nav_item;

    return(
        <div className={`d-flex flex-column align-items-center ${style.nav_item_wrapper}`}>
            <Link className={`text-center text-decoration-none ${mainClassName} ${className}`} href={href}>
                {children}
            </Link>
            <NavItemUnderline isActive={isActive} />
        </div>
    )
}

export default NavItem;