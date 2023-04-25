import style from "@styles/friends/Heading.module.scss";

import HeadingBack from "@components/global/HeadingBack";
import SearchToggler from "@components/chats/SearchToggler";
import Nav from "@components/chats/Nav";

export default function Heading() {
    return(
        <div className={`w-100 d-flex flex-column flex-lg-row align-items-center justify-content-center mb-4 ${style.friends_heading}`}>
            <div className="navbar w-100 mb-3 mb-lg-0 me-lg-3">
                <HeadingBack />
                <SearchToggler />
            </div>
            <Nav />
        </div>
    )
}