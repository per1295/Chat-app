import type { FunctionComponent } from "react"

interface ChatsMainNoneProps {
    children: JSX.Element | string;
}

const ChatsMainNone: FunctionComponent<ChatsMainNoneProps> =
({ children }) =>
{
    return(
        <span className="w-75 display-6 text-center">
            {children}
        </span>
    )
}

export default ChatsMainNone;