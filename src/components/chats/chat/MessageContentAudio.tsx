import style from "@styles/chats/chat/MessageContentAudio.module.scss";

import type { FunctionComponent } from "react";

import Icon from "@components/global/Icon";

import { useState, useEffect, useRef } from "react";
import { useTypedSelector } from "src/utils/hooks";
import {
    getMassivePartsOfNumber,
    getFullRecordingTime,
    getPartsOfRecordingFullTime,
    recordingTimeIncrement,
    isHoursGreaterOrEqualThenTen,
    getStrNumberOfParts
} from "src/utils/functions";

interface MessageContentAudioProps {
    content: string;
    idOfSender: string;
}

const MessageContentAudio: FunctionComponent<MessageContentAudioProps> = ({ content, idOfSender }) => {
    const userData = useTypedSelector<"userData">(state => state.userData);
    const [ isStarted, setIsStarted ] = useState(false);
    const [ isPlaying, setIsPlaying ] = useState(false);
    const [ passedTime, setPasssedTime ] = useState("00:00:00");
    const audioElementRef = useRef<HTMLAudioElement>(null);

    const isFriend = userData?.id !== idOfSender;

    useEffect(() => {
        let timeout: NodeJS.Timeout;

        if ( isPlaying ) {
            timeout = setTimeout(() => {
                let [ hours, minutes, seconds ] = getPartsOfRecordingFullTime(passedTime);

                const isHoursGreaterOrEqual = isHoursGreaterOrEqualThenTen(hours);

                let firstHour = 0, secondHour = 0;

                if ( isHoursGreaterOrEqual ) {
                    firstHour = parseInt(hours);
                } else {
                    [ firstHour, secondHour ] = getMassivePartsOfNumber(hours);
                }

                let [ firstMinute, secondMinute ] = getMassivePartsOfNumber(minutes);
                let [ firstSecond, secondSecond ] = getMassivePartsOfNumber(seconds);

                secondSecond += 1;

                [ firstSecond, secondSecond ] = recordingTimeIncrement(firstSecond, secondSecond);
                
                if ( firstSecond >= 6 ) {
                    secondMinute += 1;
                    firstSecond = 0;
                }

                [ firstMinute, secondMinute ] = recordingTimeIncrement(firstMinute, secondMinute);

                if ( firstMinute >= 6 ) {
                    isHoursGreaterOrEqual ? firstHour += 1 : secondHour += 1;
                    firstMinute = 0;
                }

                if ( !isHoursGreaterOrEqual ) {
                    [ firstHour, secondHour ] = recordingTimeIncrement(firstHour, secondHour);
                }

                if ( isHoursGreaterOrEqual ) {
                    hours = getStrNumberOfParts(firstHour);
                } else {
                    hours = getStrNumberOfParts(firstHour, secondHour);
                }

                minutes = getStrNumberOfParts(firstMinute, secondMinute);
                seconds = getStrNumberOfParts(firstSecond, secondSecond);

                const newPassedTime = getFullRecordingTime(hours, minutes, seconds);

                setPasssedTime(newPassedTime);
            }, 1000);
        }

        return () => {
            if ( timeout ) clearTimeout(timeout);
        }
    }, [ isPlaying, passedTime ]);

    useEffect(() => {
        const audioElement = audioElementRef.current as HTMLAudioElement;

        if ( isStarted ) {
            audioElement.play();
        } else {
            audioElement.pause();
        }
    }, [ isStarted ]);

    const onClick = () => setIsStarted(isStarted => !isStarted);

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => {
        setIsStarted(false);
        setIsPlaying(false);
        setPasssedTime("00:00:00");
    }

    const mainIconClassName = isPlaying ? "bi-stop-circle" : "bi-play-circle";

    return(
        <div className={`px-4 py-3 ${style.chat_message_content_audio}`} data-is-friend={isFriend}>
            <div className={`d-flex align-items-center justify-content-center gap-2 ${style.chat_message_content_audio_content}`}>
                <Icon className={`${mainIconClassName} d-flex ${style.chat_message_content_audio_content_icon}`} onClick={onClick} />
                <span className={style.chat_message_content_audio_content_passedTime}>
                    {passedTime}
                </span>
            </div>
            <audio
                className="visually-hidden"
                ref={audioElementRef}
                src={content}
                onPlay={onPlay}
                onPause={onPause}
                onEnded={onEnded}
            />
        </div>
    )
}

export default MessageContentAudio;