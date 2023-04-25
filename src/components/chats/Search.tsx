import style from "@styles/chats/Search.module.scss";

import SearchInput from "./SearchInput";
import SearchScan from "./SearchScan";
import SearchToggler from "./SearchToggler";

export default function Search() {
    return(
        <div
            className={`navbar align-self-center d-flex justify-content-center flex-nowrap mt-lg-0 mb-lg-0 ${style.chats_search}`}
        >
            <SearchToggler />
            <SearchInput />
            <SearchScan />
        </div>
    )
}