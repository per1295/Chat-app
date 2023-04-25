import style from "@styles/addPerson/PersonsItemAdd.module.scss";

import type { FunctionComponent, MouseEventHandler } from "react";
import type { AddUsersDataUser } from "src/types/redux";

import Icon from "@components/global/Icon";

import { useTypedSelector, useTypedDispatch, useTooltip } from "src/utils/hooks";
import { patchFriendRequest } from "src/redux/addUsersData";

interface PersonsItemAddProps {
    id: string;
    status: AddUsersDataUser["status"];
}

const PersonsItemAdd: FunctionComponent<PersonsItemAddProps> = ({ id, status }) => {
    const userData = useTypedSelector<"userData">(state => state.userData);
    const dispatch = useTypedDispatch();

    const tooltipContent = status === "none" ? "Add user as friend" :
    status === "requested" ? "Remove user`s invitation" :
    status === "accepted" ? "Remove user from friends" :
    status === "waiting" ? "Wating..." : "Try again";
    
    useTooltip({
        id: `persons-item-add-${id}`,
        placement: "left",
        title: status !== "accepted" ? tooltipContent : ""
    });

    const onClick: MouseEventHandler = () => {
        if ( userData ) {
            const newStatus = status === "none" ? "requested" :
            status === "requested" ? "none" : status

            dispatch(
                patchFriendRequest({
                    idOfRequester: userData.id,
                    idOfResponser: id,
                    status: newStatus
                })
            );
        }
    }

    const iconClassName = status === "none" ? "bi-plus-lg" :
    status === "requested" ? "bi-check-lg" :
    status === "accepted" ? "bi-check-all" :
    status === "waiting" ? "bi-hourglass-split" : "bi-exclamation-square";

    return(
        <button
            type="button"
            id={`persons-item-add-${id}`}
            className={`position-relative border-0 rounded-circle ${style.addPerson_persons_item_add}`} disabled={status === "waiting" || false}
            onClick={onClick}
        >
            <Icon className={`${iconClassName} position-absolute top-50 start-50 translate-middle ${style.addPerson_persons_item_add_icon}`} />
        </button>
    )
}

export default PersonsItemAdd;