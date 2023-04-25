import style from "@styles/global/LoadingProgress.module.scss";

import { useEffect, useState, useRef } from "react";

import type { LoadingProgressStateItem, LoadingProgressServiceWorkerMessage } from "src/types/functions";

export default function LoadingProgress() {
    const [ isAllLoaded, setIsAllLoaded ] = useState(false);
    const [ messages, setMessages ] = useState<LoadingProgressStateItem[] | null>(null);
    const [ progress, setProgress ] = useState<number | null>(null);

    const progressElementRef = useRef<HTMLDivElement>(null);
    
    function messageHandler(event: MessageEvent<LoadingProgressServiceWorkerMessage>) {
        const { type, payload } = event.data;

        if ( type === "LOADING_STATUS" ) {
            setMessages(messages => {
                if ( messages ) {
                    switch(payload.status) {
                        case "loading":
                            messages.push(payload);
                            break;
                        case "idle":
                            messages = messages.filter(message => message.id !== payload.id);
                            messages.push(payload);
                            break;
                    }
    
                    return messages;
                } else {
                    return [ payload ];
                }
            });
        }
    }

    useEffect(() => {
        navigator.serviceWorker.addEventListener("message", messageHandler);

        return () => {
            navigator.serviceWorker.removeEventListener("message", messageHandler);
        }
    }, []);

    useEffect(() => {
        if ( messages ) {
            const loadedMessagesCount = messages.filter(message => message.status === "idle").length;
            const allMessagesCount = messages.length;

            setProgress( Math.floor(loadedMessagesCount / allMessagesCount * 100) );

            setIsAllLoaded(
                !messages.some(message => message.status !== "idle")
            );
        }
    }, [ messages ]);

    useEffect(() => {
        const progressElement = progressElementRef.current as HTMLDivElement;
        const bar = progressElement.firstElementChild as HTMLDivElement;
        let progressAnimation: Animation;

        if ( progress ) {
            const { width: progressWidth } = getComputedStyle(progressElement);
            const { width: barWidth } = getComputedStyle(bar);

            const nowProgress = Math.floor(
                parseFloat(barWidth) / parseFloat(progressWidth) * 100
            );

            if ( nowProgress < progress ) {
                progressAnimation = bar.animate(
                    [
                        {
                            width: `${nowProgress}%`
                        },
                        {
                            width: `${progress}%`
                        }
                    ],
                    {
                        duration: 100,
                        easing: "ease",
                        fill: "forwards"
                    }
                );
    
                progressAnimation.commitStyles();
            }
        }

        return () => {
            if ( progressAnimation ) progressAnimation.finish();
        }
    }, [ progress ]);

    useEffect(() => {
        const progressElement = progressElementRef.current as HTMLDivElement;

        if ( isAllLoaded ) {
            progressElement.classList.add(style.custom_progress_ended);
            setMessages(null);
        } else {
            progressElement.classList.remove(style.custom_progress_ended)
        }
    }, [ isAllLoaded ]);

    return(
        <div ref={progressElementRef} className={`fixed-top ${style.custom_progress}`}>
            <div className={style.custom_progress_bar} />
        </div>
    )
}