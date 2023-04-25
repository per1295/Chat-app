import style from "@styles/global/Alerts.module.scss";

import Alert from "./Alert";

import { useTypedSelector } from "src/utils/hooks";
import { useRef, useEffect } from "react";

export default function Alerts() {
    const alerts = useTypedSelector<"alerts">(state => state.alerts);
    const alertsElementRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const alertsElement = alertsElementRef.current;

        if ( alertsElement && alerts ) {
            alertsElement.scrollTo({
                behavior: "smooth",
                top: alertsElement.scrollHeight
            });
        }
    }, [ alerts ]);

    if ( alerts.length ) {
        return(
            <div ref={alertsElementRef} className={`position-fixed d-flex flex-column align-items-center align-items-md-start overflow-scroll ${style.alerts}`}>
                {
                    alerts.map(({id, title, icon}) => (
                        <Alert key={id} id={id} icon={icon}>
                            {title}
                        </Alert>
                    ))
                }
            </div>
        )
    }

    return null
}