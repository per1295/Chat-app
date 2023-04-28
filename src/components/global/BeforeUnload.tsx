import { useEffect } from "react";
import { useAxios, useTypedSelector } from "src/utils/hooks";

export default function BeforeUnload() {
    const userData = useTypedSelector<"userData">(state => state.userData);
    const { axiosFn } = useAxios("/changeUserStatus", "patch", { id: userData?.id, status: "offline" });

    useEffect(() => {
        if ( userData ) {
            window.addEventListener("beforeunload", axiosFn);
        }
    }, [ userData ]);

    return null;
}