import style from "@styles/login/Bottom.module.scss";

import BottomIcon from "./BottomIcon";

export default function Bottom() {
    return(
        <div className={`align-self-center d-flex justify-content-between align-items-center ${style.login_bottom}`}>
            <BottomIcon className="bi bi-google" />
            <BottomIcon className="bi bi-apple" />
            <BottomIcon className="bi bi-facebook" />
        </div>
    )
}