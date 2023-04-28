import { useEffect, useState } from "react";
import { useAxios, useTypedSelector } from "src/utils/hooks";

export default function BeforeUnload() {
    const userData = useTypedSelector<"userData">(state => state.userData);
    const { axiosFn } = useAxios("/changeUserStatus", "patch", { id: userData?.id, status: "offline" });
    const [ nowUserId, setNowUserId ] = useState<string | null>(null);

    useEffect(() => {
        if ( userData ) {
            setNowUserId(userData.id);
        }
    }, [ userData ]);

    useEffect(() => {
        if ( nowUserId && userData && userData.id !== nowUserId ) {
            axiosFn();
            setNowUserId(userData.id);
        }
    }, [ userData, nowUserId ]);

    useEffect(() => {
        if ( userData ) {
            window.addEventListener("beforeunload", () => axiosFn());
        }
    }, [ userData ]);

    return null;
}