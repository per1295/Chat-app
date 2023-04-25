import style from "@styles/chats/BottomWrapperMd.module.scss";

import type { FunctionComponent } from "react";
import type { Offcanvas } from "bootstrap";

import BottomCloseButton from "./BottomCloseButton";

import { useOffcanvas } from "src/utils/hooks";
import { useEffect } from "react";
import { useRouter } from "next/router";

interface BottomWrapperMdProps {
    children: JSX.Element | JSX.Element[];
    setBottomOffcanvas: (offcanvas: Offcanvas) => any;
}

const BottomWrapperMd: FunctionComponent<BottomWrapperMdProps> =
({ children, setBottomOffcanvas }) =>
{
    const router = useRouter();
    const offcanvas = useOffcanvas({
        id: "left_menu",
        callback: setBottomOffcanvas
    });

    useEffect(() => {
        if ( offcanvas ) {
            offcanvas.hide();
        }
    }, [ router.pathname, offcanvas ]);

    return(
        <div
            className={`
                d-none
                d-md-block
                offcanvas
                offcanvas-start
                ${style.chats_bottom_wrapper_md}
            `}
            id="left_menu"
            tabIndex={-1}
        >
            <div
                className={`
                    offcanvas-body
                    h-100
                    d-flex
                    flex-column
                    align-items-center
                    justify-content-center
                    ${style.chats_bottom_md}
                `}
            >
                <BottomCloseButton />
                {children}
            </div>
        </div>
    )
}

export default BottomWrapperMd;