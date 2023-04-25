import style from "@styles/global/ErrorComponent.module.scss";

import type { FunctionComponent } from "react";
import type { ErrorProps } from "src/types/functions";

const ErrorComponent: FunctionComponent<ErrorProps> = ({ errorName, errorMessage }) => {
    return(
        <div className="d-flex flex-column align-items-center text-center error">
            <span className={`d-inline-block w-75 mb-3 ${style.error_title}`}>
                {errorName}
            </span>
            <span className={`d-inline-block w-75 ${style.error_subTitle}`}>
                {errorMessage}
            </span>
        </div>
    )
}

export default ErrorComponent;