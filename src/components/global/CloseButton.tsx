import type { FunctionComponent, MouseEventHandler } from "react";

interface CloseButtonProps {
    className?: string;
    onClick?: MouseEventHandler;
}

const CloseButton: FunctionComponent<CloseButtonProps> =
({ className, onClick }) =>
{
    return(
        <button
            className={`
                btn
                btn-close
                ${className}
            `}
            onClick={onClick}
        >
        </button>
    )
}

export default CloseButton