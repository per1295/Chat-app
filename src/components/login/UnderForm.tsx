import style from "@styles/login/UnderForm.module.scss";

import UnderFormHr from "./UnderFormHr"

export default function UnderForm() {
    return(
        <div className={`align-self-center d-flex align-items-center gap-2 text-center ${style.login_underForm}`}>
            <UnderFormHr />
            <span className={style.login_underForm_text}>Or Login with</span>
            <UnderFormHr />
        </div>
    )
}