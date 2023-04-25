import style from "@styles/global/Audio.module.scss";

import type { FunctionComponent } from "react";

import Icon from "./Icon";
import Button from "./Button";

import { useState, useEffect, useRef } from "react";
import {
    getPartsOfRecordingFullTime,
    getMassivePartsOfNumber,
    recordingTimeDecrement,
    isHoursGreaterOrEqualThenTen,
    getStrNumberOfParts,
    getFullRecordingTime,
    isAudioTimeEnd
} from "src/utils/functions";

interface AudioProps {
    data: Blob;
    duration: string;
    cleanData: () => any;
}

const Audio: FunctionComponent<AudioProps> = ({ data, duration, cleanData }) => {
    const [ isStarted, setIsStarted ] = useState(false);
    const [ isPlaying, setIsPlaying ] = useState(false);
    const [ recordingTime, setRecordingTime ] = useState(duration);
    const [ isEnded, setIsEnded ] = useState(false);
    const audioElemRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        const audioElem = audioElemRef.current as HTMLAudioElement;

        if ( !audioElem.src || isEnded ) {
            if ( audioElem.src ) {
                URL.revokeObjectURL(audioElem.src);
                audioElem.src = "";
            }

            audioElem.src = URL.createObjectURL(data);
        }

        if ( isStarted ) {
            audioElem.play();
        } else {
            audioElem.pause();
        }
    }, [ isStarted, isEnded ]);

    useEffect(() => {
        let timeout: NodeJS.Timeout;

        if ( isPlaying ) {
            if ( isAudioTimeEnd(recordingTime) && !isEnded ) {
                setRecordingTime("00:00:00:0000");
                setIsStarted(false);
                setIsPlaying(false);
                setIsEnded(true);
            } else {
                timeout = setTimeout(() => {
                    let [ hours, minutes, seconds, milliseconds ] = getPartsOfRecordingFullTime(recordingTime);
    
                    const isHoursGreaterOrEqual = isHoursGreaterOrEqualThenTen(hours);
    
                    let firstHour = 0, secondHour = 0;
    
                    if ( isHoursGreaterOrEqual ) {
                        firstHour = parseInt(hours);
                    } else {
                        [ firstHour, secondHour ] = getMassivePartsOfNumber(hours);
                    }
    
                    let [ firstMinute, secondMinute ] = getMassivePartsOfNumber(minutes);
                    let [ firstSecond, secondSecond ] = getMassivePartsOfNumber(seconds);
                    let [ first, second, third, fourth ] = getMassivePartsOfNumber(milliseconds);
    
                    fourth -= 1;
    
                    [ third, fourth ] = recordingTimeDecrement(third, fourth);
                    [ second, third ] = recordingTimeDecrement(second, third);
                    [ first, second ] = recordingTimeDecrement(first, second);
                    
                    if ( first < 0 ) {
                        secondSecond -= 1;
                        first = 0;
                    }
    
                    [ firstSecond, secondSecond ] = recordingTimeDecrement(firstSecond, secondSecond);
    
                    if ( firstSecond < 0 ) {
                        secondMinute -= 1;
                        firstSecond = 5;
                    }
    
                    [ firstMinute, secondMinute ] = recordingTimeDecrement(firstMinute, secondMinute);
    
                    if ( firstMinute < 0 ) {
                        isHoursGreaterOrEqual ? firstHour -= 1 : secondHour -= 1;
                        firstMinute = 5;
                    }
    
                    if ( !isHoursGreaterOrEqual ) {
                        [ firstHour, secondHour ] = recordingTimeDecrement(firstHour, secondHour);
                    }
    
                    milliseconds = getStrNumberOfParts(first, second, third, fourth);
                    seconds = getStrNumberOfParts(firstSecond, secondSecond);
                    minutes = getStrNumberOfParts(firstMinute, secondMinute);
                    
                    if ( isHoursGreaterOrEqual ) {
                        hours = getStrNumberOfParts(firstHour);
                    } else {
                        hours = getStrNumberOfParts(firstHour, secondHour);
                    }
    
                    const finalyRecordingTime = getFullRecordingTime(hours, minutes, seconds, milliseconds);
    
                    setRecordingTime(finalyRecordingTime);
                }, 1);
            } 
        }

        return () => {
            if ( timeout ) clearTimeout(timeout);
        }
    }, [ isPlaying, isEnded, recordingTime ]);

    useEffect(() => {
        if ( isEnded && isPlaying ) {
            setRecordingTime(duration);
            setIsEnded(false);
        }
    }, [ isPlaying, isEnded ]);

    const iconClassName = isPlaying ? "bi-stop-circle" : "bi-play-circle";

    const onClick = () => setIsStarted(isStarted => !isStarted);

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => {
        setRecordingTime("00:00:00:0000");
        setIsStarted(false);
        setIsPlaying(false);
        setIsEnded(true);
    }

    return(
        <div className={`d-flex align-items-center justify-content-center px-3 py-2 gap-3 rounded-pill ${style.audio}`}>
            <Icon className={`${iconClassName} ${style.audio_icon}`} onClick={onClick} />
            <span className={style.audio_duration}>
                {recordingTime}
            </span>
            <Button className="btn-close" onClick={cleanData} />
            <audio
                ref={audioElemRef}
                className="visually-hidden"
                onPlay={onPlay}
                onPause={onPause}
                onEnded={onEnded}
            />
        </div>
    )
}

export default Audio;