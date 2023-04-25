import style from "@styles/chats/chat/NoMessages.module.scss";

export default function NoMessages() {
    return(
        <div className="position-absolute top-50 start-50 translate-middle w-100 text-center chat_noMessages">
            <h1 className={style.chat_noMessages_main_text}>
                There are no messages yet.
            </h1>
            <h2 className={style.chat_noMessages_sub_text}>
                You can write something first.
            </h2>
        </div>
    )
}