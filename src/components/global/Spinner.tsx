import type { FunctionComponent } from "react";

interface SpinnerProps {
    type: "border" | "grow";
    className?: string;
    size?: "sm";
}

const Spinner: FunctionComponent<SpinnerProps> = ({ type, className, size }) => {
    const typeOfSpinner = type === "border" ? "spinner-border" : "spinner-grow";
    const sizeOfSpinner = size ? type === "border" ? "spinner-border-sm" : "spinner-grow-sm" : "";

    return(
        <div className="d-flex justify-content-center align-items-center">
            <div 
                className={`${typeOfSpinner} ${sizeOfSpinner} ${className}`}
                role="status"
            >
                <span className="visually-hidden">Waiting...</span>
            </div>
        </div>
    )
}

export default Spinner;