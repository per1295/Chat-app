import style from "@styles/chats/SearchToggler.module.scss";

import { useContext } from "react";
import { OffcanvasContext } from "src/utils/contexts";

export default function SearchToggler() {
    const offcanvasContext = useContext(OffcanvasContext);

    return(
        <button
            className={`
                navbar-toggler
                d-none
                d-md-block
                ${style.chats_search_toggler}
            `}
            onClick={() => {
                if ( offcanvasContext && offcanvasContext.current ) {
                    offcanvasContext.current.show();
                }
            }}
        >
            <span className="navbar-toggler-icon"></span>
          </button>
    )
}