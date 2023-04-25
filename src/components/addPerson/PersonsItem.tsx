import style from "@styles/addPerson/PersonsItem.module.scss";

import type { FunctionComponent } from "react";
import type { AddUsersDataUser } from "src/types/redux";

import Link from "next/link";
import PersonsItemAdd from "./PersonsItemAdd";

import { useLocalStorage } from "src/utils/hooks";

const PersonsItem: FunctionComponent<AddUsersDataUser> = ({ id, username, status }) => {
    const storage = useLocalStorage();
    const headingInput = storage?.getItem("heading-input");

    return(
        <div className={`position-relative d-flex align-items-center justify-content-between py-2 px-3 ${style.addPerson_persons_item}`}>
            <span className={`text-truncate ${style.addPerson_persons_item_username}`}>
                {
                    username.split("").map((word, index) => headingInput?.match(word.toLowerCase()) ? <span key={index} className={style.addPerson_persons_item_username_match}>{word}</span> : word)
                }
            </span>
            <PersonsItemAdd id={id} status={status} />
            <Link className="position-absolute top-0 start-0 h-100 w-100" href={`/users/${id}`} />
        </div>
    )
}

export default PersonsItem;