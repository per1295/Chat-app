import style from "@styles/global/Alert.module.scss";

import type { FunctionComponent } from "react";

import Button from "./Button";
import Icon from "./Icon";

import { useTypedDispatch } from "src/utils/hooks";
import { useRef } from "react";
import { removeAlert } from "src/redux/alerts";

interface AlertProps {
    id: string;
    children: string | JSX.Element | (string | JSX.Element)[];
    icon: "info" | "error";
}

const Alert: FunctionComponent<AlertProps> = ({ id, children, icon }) => {
    const dispatch = useTypedDispatch();
    const alertRef = useRef<HTMLDivElement>(null);

    const remove = () => {
        const alert = alertRef.current;
        if ( alert ) alert.classList.remove("show");
    }

    const onTransitionEnd = () => dispatch( removeAlert(id) );

    const iconClassName = icon === "info" ? "bi-info-circle" : `bi-exclamation-square ${style.alert_error_icon}`;

    return(
        <div
            ref={alertRef}
            id={id}
            className={`w-100 alert alert-dismissible fade show ${style.alert}`} role="alert"
            onTransitionEnd={onTransitionEnd}
        >
            <Button
                type="button"
                className="btn-close"
                onClick={remove}
            />
            <span className="d-flex gap-3">
                <Icon className={iconClassName} />
                {children}
            </span>
        </div>        
    )
}

export default Alert;