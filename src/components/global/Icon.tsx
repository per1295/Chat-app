import type { FunctionComponent, AriaRole, MouseEventHandler } from "react";
import type { AnyObject } from "src/types/functions";

interface IconProps extends Partial<AnyObject> {
    className: string;
    onClick?: MouseEventHandler;
    role?: AriaRole;
}

const Icon: FunctionComponent<IconProps> = ({ className, onClick, role, ...props }) => {
    return(
        <i className={`bi ${className}`} role={role} onClick={onClick} {...props}></i>
    )
}

export default Icon;