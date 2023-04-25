import style from "@styles/login/BottomIcon.module.scss";

import type { FunctionComponent } from "react";

interface BottomIconProps {
    className: string;
}

const BottomIcon: FunctionComponent<BottomIconProps> = ({ className }) => {
    return(
        <i className={`d-flex ${className} ${style.login_bottom_i}`} />
    )
}

export default BottomIcon;