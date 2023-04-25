import style from "@styles/chats/BottomCloseButton.module.scss"

import CloseButton from "@components/global/CloseButton";

import { useContext } from "react";
import { OffcanvasContext } from "src/utils/contexts";

export default function BottomCloseButton() {
    const offcanvasContext = useContext(OffcanvasContext);

    return(
        <CloseButton
            className={`
                d-none
                d-md-block
                position-absolute
                top-0
                start-50
                translate-middle-x
                mt-5
                ${style.chats_bottom_close}
            `}
            onClick={() => {
                if ( offcanvasContext && offcanvasContext.current ) {
                    offcanvasContext.current.hide();
                }
            }}
        />
    )
}