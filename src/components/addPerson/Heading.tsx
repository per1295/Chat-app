import style from "@styles/addPerson/Heading.module.scss";

import HeadingBack from "@components/global/HeadingBack";
import HeadingInput from "./HeadingInput";
import SearchToggler from "@components/chats/SearchToggler";

export default function Heading() {
    return(
        <div className={`navbar d-flex flex-nowrap align-items-center justify-content-center gap-4 px-4 mb-5 ${style.addPerson_heading}`}>
            <HeadingBack />
            <HeadingInput />
            <SearchToggler />
        </div>
    )
}