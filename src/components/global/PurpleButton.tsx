import style from "@styles/global/PurpleButton.module.scss";

import type { FunctionComponent } from "react";

import Button from "./Button";

interface PurpleButtonProps {
    children: JSX.Element | string;
    className?: string;
    type?: "button" | "submit" | "reset";
    disabled?: boolean;
}

const PurpleButton: FunctionComponent<PurpleButtonProps> = ({ children, className, type, disabled }) => {
    return(
        <Button
            type={type ?? "button"}
            className={`position-relative align-self-center rounded-pill text-center text-truncate ${style.purpleButton} ${className}`}
            disabled={disabled}
        >
            { children }
        </Button>
    )
}

export default PurpleButton;