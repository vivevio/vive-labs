// @ts-ignore
import MultiStreamsMixer from 'multistreamsmixer';
import { useRef, useState } from 'react';
import RecordRTC, { RecordRTCPromisesHandler } from 'recordrtc';
import { audioBufferToMediaStream, getAspectRatio, getVideoOptions } from '@/utils/media-recorder-helper'
import useWindowDimension from './useWindowDimension';

interface VideoRecorderProps {
    videoPreviewRef: React.RefObject<HTMLVideoElement>;
    audioScriptBuffer: AudioBuffer | null;
    onDataStreamChanged?: ( blob:Blob ) => void;
}

type RecordingState = 'iddle' | 'preparing' | 'recording';

export default function useVideoRecorder({
    videoPreviewRef,
    audioScriptBuffer,
    onDataStreamChanged= () => {}
} : VideoRecorderProps ) {
    const recorderRef = useRef<RecordRTCPromisesHandler|null>(null);
    const videoRecordingStream = useRef<MediaStream|null>(null);
    const { videoFormat, mimeType, videoBitsPerSecond} = getVideoOptions();
    const [recordingState, setRecordingState] = useState<RecordingState>('iddle');
    const { width, height } = useWindowDimension();

    const initialRequestCamera = async () : Promise<MediaStream> => {
        return navigator.mediaDevices.getUserMedia({
            video: { 
                width: { ideal: 360 }, 
                // height: { ideal: 640 },
                frameRate: { ideal: 30, max: 30, min: 15 }, 
                facingMode: 'user',
                // aspectRatio: 16 / 9
                aspectRatio: getAspectRatio(width, height)
            },
            audio: true
        });
    }

    const previewCamera = () => {
        initialRequestCamera().then(async function(videoStream:MediaStream) {
            if(videoPreviewRef.current) {
                videoPreviewRef.current.srcObject = videoStream;
                videoPreviewRef.current.onloadedmetadata = () => {
                    videoPreviewRef.current?.play();
                };
            }
        });
    }

    const startRecording = ( callback:()=>void ) => {
        setRecordingState('preparing');
        initialRequestCamera().then(async function(videoStream:any) {
            videoStream.fullcanvas = true;
            videoStream.width = videoPreviewRef.current?.getBoundingClientRect()?.width; // or 3840
            videoStream.height = videoPreviewRef.current?.getBoundingClientRect()?.height; // or 2160 

            if(videoPreviewRef.current) {
                videoPreviewRef.current.srcObject = videoStream;
                videoPreviewRef.current.onloadedmetadata = () => {
                    videoPreviewRef.current?.play();
                };
            }
            
            videoRecordingStream.current = videoStream;
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const audioScript = await audioBufferToMediaStream(audioScriptBuffer as AudioBuffer, audioContext);
            const mixer = new MultiStreamsMixer([videoStream, audioScript]);
            const mixed = mixer.getMixedStream();

            mixer.frameInterval = 1;
            mixer.startDrawingFrames();

            recorderRef.current = new RecordRTCPromisesHandler(mixed, {
                recorderType: RecordRTC.MediaStreamRecorder,
                type: 'video',
                mimeType,
                bitsPerSecond: videoBitsPerSecond,
                timeSlice: 5000,
                ondataavailable: async (blob:Blob) => {
                    onDataStreamChanged(blob);
                    // const arrayb = await blob.arrayBuffer();
                    // socket.emit("stream", arrayb);
                },
                disableLogs: true
            });

            await recorderRef.current.startRecording();
            setRecordingState('recording');
            callback();
        });

    }

    
    const stopRecording = (callback: (result:{blob:Blob, format:string, mimeType:string}) => void) => {
        recorderRef.current?.stopRecording().then(() => {
            setRecordingState('iddle');
            callback({
                blob: recorderRef.current?.blob as Blob,
                format: videoFormat,
                mimeType: mimeType
            });
            videoRecordingStream.current?.getTracks().forEach((track) => {
                console.log('track stop', track);
                track.stop();
                videoRecordingStream.current?.removeTrack(track);
            });

        })
    }

    const pauseRecording = ( callback:()=>void ) => {
        recorderRef.current?.pauseRecording().then(callback)
    }

    const resumeRecording = ( callback:()=>void ) => {
        recorderRef.current?.resumeRecording().then(callback);
    }

    return {
        startRecording,
        stopRecording,
        pauseRecording,
        resumeRecording,
        previewCamera,
        isRecording: recordingState == 'recording',
        isPreparing: recordingState == 'preparing',
        videoConfig: {
            mimeType,
            videoFormat
        },
        mediaStream: videoRecordingStream.current
    }

}
