import style from "@styles/chats/ChatsMainItem.module.scss";

import type { FunctionComponent } from "react";
import type { Chat } from "src/types/chats";

import Image from "next/image";
import Icon from "@components/global/Icon";
import ChatsMainItemInf from "./ChatsMainItemInf";
import ChatsMainItemBirth from "./ChatsMainItemBirth";
import Link from "next/link";

const ChatsMainItem: FunctionComponent<Chat> =
({ id, username, profileImage, lastMessage }) =>
{
    return(
        <div className={`
            position-relative
            d-flex
            align-items-center
            py-2
            px-3
            ${style.chats_main_item}
        `}>
            {
                profileImage
                ?
                <Image
                    className={`
                        rounded-circle
                        ${style.chats_main_item_img}
                    `}
                    src={profileImage}
                    alt="profile_img"
                    width={50}
                    height={50}
                />
                :
                <Icon className={`bi-person-circle ${style.chats_main_item_icon}`} />
            }
            <ChatsMainItemInf
                username={username}
                lastMessage={lastMessage}
            />
            {
                lastMessage?.birth
                ?
                <ChatsMainItemBirth>
                    {lastMessage.birth}
                </ChatsMainItemBirth>
                :
                null
            }
            <Link className="stretched-link" href={`/chats/${id}`} />
        </div>
    )
}

export default ChatsMainItem;