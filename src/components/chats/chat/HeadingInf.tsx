import style from "@styles/chats/chat/HeadingInf.module.scss";

import Image from "next/image";
import Icon from "@components/global/Icon";
import HeadingInfText from "./HeadingInfText";

import { useChatData } from "src/utils/hooks";

export default function HeadingInf() {
    const chatData = useChatData();

    return(
        <div className={`flex d-flex align-items-center ms-4 ${style.chat_heading_inf}`}>
            {
                chatData?.profileImage
                ?
                <Image className={`rounded-circle ${style.chat_heading_inf_img}`} src={chatData.profileImage} alt="profile_image" height={50} width={50} />
                :
                <Icon className={`bi-person-circle ${style.chat_heading_inf_icon}`} />
            }
            <HeadingInfText />
        </div>
    )
}