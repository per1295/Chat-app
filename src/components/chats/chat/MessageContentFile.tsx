import style from "@styles/chats/chat/MessageContentFile.module.scss";

import type { FunctionComponent } from "react";

import Icon from "@components/global/Icon";

import { useState, useEffect } from "react";
import { useTypedSelector } from "src/utils/hooks";
import { bytesTo } from "src/utils/functions";

interface MessageContentFileProps {
    content: string;
    idOfSender: string;
}

const MessageContentFile: FunctionComponent<MessageContentFileProps> = ({ content, idOfSender }) => {
    const [ file, setFile ] = useState<File | null>(null);
    const userData = useTypedSelector<"userData">(state => state.userData);

    const isFriend = userData?.id !== idOfSender;

    useEffect(() => {
        if ( !file ) {
            setFile(
                new File([content], "user-file", { type: "base64" })
            )
        }
    }, [ file ]);

    return file && (
        <div className={`mw-100 d-flex align-items-center px-4 py-3 ${style.message_content_file}`} data-is-friend={isFriend}>
            <Icon className={`bi-file-earmark-fill ${style.message_content_file_icon}`} />
            <div className={`d-flex flex-column text-truncate ms-3 ${style.message_content_file_inf}`}>
                <span>Name: {file.name}</span>
                <span>Size: { bytesTo(file.size, "kb", 3) }kb</span>
            </div>
            <a className="stretched-link" href={content} download />
        </div>
    )
}

export default MessageContentFile;