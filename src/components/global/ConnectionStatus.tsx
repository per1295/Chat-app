import { useEffect } from "react";
import { useTypedDispatch } from "src/utils/hooks";
import { addAlert } from "src/redux/alerts";

import type { ConnectionStatusServiceWorkerMessage } from "src/types/functions";

export default function ConnectionStatus() {
    const dispatch = useTypedDispatch();

    function message(event: MessageEvent<ConnectionStatusServiceWorkerMessage>) {
        const { type } = event.data;
        const { status } = event.data.payload;

        if ( type === "CONNECTION_STATUS" ) {
            dispatch(
                addAlert({
                    title: status,
                    icon: status === "online" ? "info" : "error"
                })
            );
        }
    }

    useEffect(() => {
        navigator.serviceWorker.addEventListener("message", message);

        return () => {
            navigator.serviceWorker.removeEventListener("message", message);
        }
    }, []);

    return null;
}