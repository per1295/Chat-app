import { useTypedDispatch } from "src/utils/hooks";
import { addAlert, removeAlert } from "src/redux/alerts";
import { useEffect, useId } from "react";

export default function CookieAcception() {
    const dispatch = useTypedDispatch();
    const id = useId();

    useEffect(() => {
        dispatch(
            addAlert({
                id,
                title: "Using our site, you agree that our site may use cookies.",
                icon: "info"
            })
        );

        return () => {
            dispatch( removeAlert(id) );
        }
    }, []);

    return null;
}