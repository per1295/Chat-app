import style from "@styles/login/Heading.module.scss";

import HeadingBack from "../global/HeadingBack";

export default function Heading() {
    return(
        <div className={style.login_heading}>
            <HeadingBack />
        </div>
    )
}