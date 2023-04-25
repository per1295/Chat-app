import style from "@styles/chats/chat/VoiceRecorder.module.scss";

import Icon from "@components/global/Icon";
import Audio from "@components/global/Audio";

import { useEffect, useState } from "react";
import {
    getPartsOfRecordingFullTime,
    getMassivePartsOfNumber,
    recordingTimeIncrement,
    getStrNumberOfParts,
    getFullRecordingTime,
    isHoursGreaterOrEqualThenTen
} from "src/utils/functions";

import type { FunctionComponent, Dispatch, SetStateAction } from "react";
import type { ChatModal } from "src/types/chat";

interface VoiceRecorderProps {
    setModal: Dispatch<SetStateAction<ChatModal>>;
}

const VoiceRecorder: FunctionComponent<VoiceRecorderProps> = ({ setModal }) => {
    const [ isRecording, setIsRecording ] = useState(false);
    const [ recordingTime, setRecordingTime ] = useState<string | null>(null);
    const [ isAccepted, setIsAccepted ] = useState(false);
    const [ audioData, setAudioData ] = useState<Blob | null>(null);

    const iconClassName = isRecording ? "bi-stop-circle" : "bi-play-circle";

    useEffect(() => {
        if ( audioData ) setModal(modal => ({ ...modal, data: audioData }));
    }, [ audioData ]);

    useEffect(() => {
        let timeout: NodeJS.Timeout;

        if ( isRecording && isAccepted ) {
            timeout = setTimeout(() => {
                if ( recordingTime ) {
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

                    fourth += 1;

                    [ third, fourth ] = recordingTimeIncrement(third, fourth);
                    [ second, third ] = recordingTimeIncrement(second, third);
                    [ first, second ] = recordingTimeIncrement(first, second);
                    
                    if ( first >= 1 ) {
                        secondSecond += 1;
                        first = 0;
                    }

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
                } else {
                    setRecordingTime("00:00:00:0000");
                }
            }, 1);
        }

        return () => {
            if ( timeout ) clearTimeout(timeout);
        }
    }, [ isRecording, isAccepted, recordingTime ]);

    useEffect(() => {
        let mediaStream: MediaStream;
        let audioRecorder: MediaRecorder;

        if ( isRecording ) {
            (async () => {
                mediaStream = await navigator.mediaDevices.getUserMedia({
                    audio: {
                        sampleSize: 16,
                        channelCount: 2,
                        echoCancellation: false
                    }
                });
    
                audioRecorder = new MediaRecorder(mediaStream);
    
                audioRecorder.addEventListener("start", () => {
                    setIsAccepted(true);
                });

                audioRecorder.addEventListener("dataavailable", event => {
                    setAudioData(event.data);
                });
    
                audioRecorder.start();
            })();
        }

        return () => {
            if ( mediaStream && audioRecorder ) {
                const audioTracks = mediaStream.getAudioTracks();

                audioTracks.forEach(audioTrack => {
                    audioTrack.stop();
                });

                audioRecorder.stop();
            }
        }
    }, [ isRecording ]);

    const onClick = () => setIsRecording(isRecording => !isRecording);

    const cleanData = () => {
        setAudioData(null);
        setRecordingTime(null);
    }

    return(
        <div className={`d-flex align-items-center justify-content-center gap-3 px-4 py-3 rounded-pill ${style.chat_voiceRecorder}`}>
            {
                audioData && recordingTime
                ?
                <Audio data={audioData} duration={recordingTime} cleanData={cleanData} />
                :
                <>
                    <Icon className={`${iconClassName} ${style.chat_voiceRecorder_icon}`} onClick={onClick} />
                    <span className={style.chat_voiceRecorder_time}>
                        {isRecording ? recordingTime ?? "Waiting..." : "Start your audio"}
                    </span>
                </>
            }
        </div>
    )
}

export default VoiceRecorder;