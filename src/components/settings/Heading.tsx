import style from "@styles/settings/Heading.module.scss";

import HeadingBack from "@components/global/HeadingBack";
import SearchToggler from "@components/chats/SearchToggler";

export default function Heading() {
    return(
        <div className={`navbar py-0 mb-5 align-self-stretch ${style.settings_heading}`}>
            <HeadingBack />
            <SearchToggler />
        </div>
    )
}