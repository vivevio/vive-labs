// @ts-ignore
import { useRef, useState } from 'react';
import RecordRTC, { RecordRTCPromisesHandler } from 'recordrtc';

interface AudioRecorderProps {
    // videoPreviewRef: React.RefObject<HTMLVideoElement>;
    // audioScript: MediaStream | null;
    // onDataStreamChanged?: ( blob:Blob ) => void;
}

type RecordingState = 'iddle' | 'preparing' | 'recording';

export default function useAudioRecorder() {

    const recorderRef = useRef<RecordRTCPromisesHandler | null>(null);
    const [recordingState, setRecordingState] = useState<RecordingState>('iddle');

    const initialRequestMicrophone = async (): Promise<MediaStream> => {
        return navigator.mediaDevices.getUserMedia({
            audio: true
        });
    }

    const startRecording = async (defaultStream?:MediaStream|null, callback?:()=>{}) => {

        setRecordingState('preparing');

        let micStream = defaultStream;
        if(!defaultStream) {
            micStream = await initialRequestMicrophone();
        }

        recorderRef.current = new RecordRTCPromisesHandler(micStream as MediaStream, {
            recorderType: RecordRTC.MediaStreamRecorder,
            type: 'audio',
            mimeType: 'audio/wav',
            disableLogs: true
        });

        await recorderRef.current.startRecording();
        setRecordingState('recording');
        callback && callback();
    }

    const stopRecording = (callback: (result:{blob:Blob}) => void) => {
        recorderRef.current?.stopRecording().then(() => {
            setRecordingState('iddle');
            callback({
                blob: recorderRef.current?.blob as Blob,
            });
        })
    }

    return {
        startRecording,
        stopRecording,
        isRecording: recordingState == 'recording',
        isPreparing: recordingState == 'preparing',
    }
}
