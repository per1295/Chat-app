import style from "@styles/global/GrayText.module.scss";

import type { FunctionComponent } from "react";

interface GrayTextProps {
    children: string | JSX.Element | (string | JSX.Element)[];
}

const GrayText: FunctionComponent<GrayTextProps> = ({ children }) => {
    return(
        <span className={`text-center ${style.grayText}`}>
            {children}
        </span>
    )
}

export default GrayText;