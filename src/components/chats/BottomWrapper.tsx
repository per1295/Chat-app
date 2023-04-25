import style from "@styles/chats/BottomWrapper.module.scss";

import type { FunctionComponent } from "react";

import { useEffect, useRef, useState } from "react";
import { useOffcanvas } from "src/utils/hooks";

interface BottomWrapperProps {
    children: JSX.Element | JSX.Element[];
}

const BottomWrapper: FunctionComponent<BottomWrapperProps> =
({ children }) =>
{
    const scrollValueRef = useRef(0);
    const [ isShown, setIsShown ] = useState(true);
    const offcanvas = useOffcanvas({
        id: "bottom_menu",
        backdrop: false,
        keyboard: false,
        scroll: true
    });

    useEffect(() => {
        if ( isShown && offcanvas ) {
            offcanvas.show();
        } else if ( offcanvas ) {
            offcanvas.hide();
        }
    }, [ isShown, offcanvas ]);

    const onScroll = () => {
        const { top } = document.body.getBoundingClientRect();
        const scrollValue = scrollValueRef.current;

        if ( top > scrollValue ) {
            setIsShown(true);
        } else {
            setIsShown(false);
        }

        scrollValueRef.current = top;
    }

    useEffect(() => {
        document.addEventListener("scroll", onScroll);

        return () => {
            document.removeEventListener("scroll", onScroll);
        }
    }, []);

    return(
        <div
            className={`
                offcanvas
                offcanvas-bottom
                show
                d-block
                d-md-none
                ${style.chats_bottom_wrapper}
            `}
            id="bottom_menu"
            data-bs-scroll="true"
            data-bs-backdrop="false"
            tabIndex={-1}
        >
            <div
                className={`
                    d-flex
                    align-items-center
                    justify-content-center
                    ${style.chats_bottom}
                `}
            >
                {children}
            </div>
        </div>
    )
}

export default BottomWrapper;