import style from "@styles/chats/Bottom.module.scss";

import BottomIcon from "./BottomIcon";

import { useRouter } from "next/router";
import { useMemo } from "react";

export default function Bottom() {
    const router = useRouter();

    const isHomeActive = useMemo(() => {
        return /\/(chats|friends|calls)/i.test(router.pathname);
    }, [router.pathname]);

    const isPersonAddActive = useMemo(() => {
        return /\/addperson/i.test(router.pathname);
    }, [router.pathname]);

    const isSettingsActive = useMemo(() => {
        return /\/settings/i.test(router.pathname);
    }, [router.pathname]);

    return(
        <div className={`
            d-flex
            flex-md-column
            align-items-center
            justify-content-between
            justify-content-md-start
            px-md-5
            ${style.chats_bottom_container}
        `}>
            <BottomIcon
                className="bi-house"
                href="/chats"
                isActive={isHomeActive}
            />
            <BottomIcon
                className="bi-person-add"
                href="/addPerson"
                isActive={isPersonAddActive}
            />
            <BottomIcon
                className="bi-gear"
                href="/settings"
                isActive={isSettingsActive}
            />
        </div>
    )
}