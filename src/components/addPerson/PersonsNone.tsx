import type { FunctionComponent } from "react";

interface PersonsNoneProps {
    children: JSX.Element | string;
}

const PersonsNone: FunctionComponent<PersonsNoneProps> = ({ children }) => {
    return(
        <span className="d-inline-block w-100 display-6 text-center text-break">
            {children}
        </span>
    )
}

export default PersonsNone;