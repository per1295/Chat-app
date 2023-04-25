import type { FunctionComponent, MouseEventHandler } from "react";

interface ButtonProps {
    children?: JSX.Element | (JSX.Element | string | null)[] | string;
    className?: string;
    type?: "button" | "submit" | "reset";
    disabled?: boolean;
    onClick?: MouseEventHandler<HTMLButtonElement>;
}

const Button: FunctionComponent<ButtonProps> = ({ children, className, type, disabled, onClick, ...props }) => {
    return(
        <button className={className} type={type ?? "button"} disabled={disabled} onClick={onClick} {...props}>
            {children}
        </button>
    )
}

export default Button;