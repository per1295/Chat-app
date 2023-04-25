import style from "@styles/chats/SearchScan.module.scss";

import { useTooltip } from "src/utils/hooks";

export default function SearchScan() {
    useTooltip({ id: "chats_search_scan" });

    return(
        <button
            type="button"
            className={`d-flex align-items-center justify-content-center p-0 border-0 ${style.chats_search_scan}`}
            data-bs-toggle="tooltip"
            data-bs-placement="top"
            title="The scanner is not working yet"
            id="chats_search_scan"
        >
            <i className="bi bi-upc-scan"></i>
        </button>
    )
}