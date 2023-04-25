import style from "@styles/chats/Layout.module.scss";

import Search from "./Search";
import Nav from "./Nav";

import type { FunctionComponent } from "react";

interface LayoutProps {
    children: JSX.Element | JSX.Element[];
}

const Layout: FunctionComponent<LayoutProps> = ({ children }) => {
    return(
        <>
            <div className={`mw-100 d-flex flex-column flex-lg-row align-items-center justify-content-lg-center gap-lg-5 ${style.chats_layout_wrapper}`}>
                <Search />
                <Nav />
            </div>
            <div className={`w-100 d-flex flex-column align-items-center mb-5 ${style.chats_layout}`}>
                { children }
            </div>
        </>
    )
}

export default Layout;