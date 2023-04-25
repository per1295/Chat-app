import NavItem from "./NavItem";

import { useTooltip } from "src/utils/hooks";

export default function NavItemCalls() {
    useTooltip({ id: "nav_item_calls" });

    return(
        <NavItem href="#">
            <span
                data-bs-toggle="tooltip"
                data-bs-placement="bottom"
                title="The calls is not working yet"
                id="nav_item_calls"
            >
                Calls
            </span>
        </NavItem>
    )
}