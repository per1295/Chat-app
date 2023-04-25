import { useEffect, useRef } from "react";
import { useTypedSelector, useAxios } from "src/utils/hooks";

export default function UserOnload() {
    const abortControllerRef = useRef(new AbortController());
    const userData = useTypedSelector<"userData">(state => state.userData);
    const { axiosFn } = useAxios(
        "/changeUserStatus",
        "patch",
        { id: userData?.id, status: "online" },
        { signal: abortControllerRef.current.signal }
    );

    useEffect(() => {
        if ( userData ) axiosFn();

        return () => {
            if ( userData ) abortControllerRef.current.abort();
        }
    }, [ userData ]);

    return null;
}