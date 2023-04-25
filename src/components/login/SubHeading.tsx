import style from "@styles/login/SubHeading.module.scss";

import Image from "next/image";

import dayflowSitting from "public/login/DayflowSitting.png";

export default function SubHeading() {
    return(
        <div className={`position-relative mw-100 align-self-md-center ${style.login_subHeading}`}>
            <div className={`position-relative ${style.login_subHeading_text}`}>
                <h1 className={style.login_subHeading_text_main}>
                    Hello, Welcome Back
                </h1>
                <span className={style.login_subHeading_text_sub}>
                    Happy to see you again, to use your account please login first.
                </span>
            </div>
            <Image className={`position-absolute ${style.login_subHeading_img}`} src={dayflowSitting} alt="dayflowSitting" placeholder="blur" quality={100} />
        </div>
    )
}