import { base64ToMediaStream, getVideoOptions } from '@/utils/media-recorder-helper'
import { SampleAudio } from './sample-audio'
// @ts-ignore
import MultiStreamsMixer from 'multistreamsmixer';
import RecordRTC, { RecordRTCPromisesHandler } from 'recordrtc';
import { useEffect, useRef, useState } from 'react';
import { zipFile } from '@/lib/zip';
import { socket } from '@/services/socket';

export default function MediaMixer() {

    const recorderRef = useRef<RecordRTCPromisesHandler|null>(null);
    const audioRecordingStream = useRef<MediaStream|null>(null);
    const [videoSource, setVideoSource] = useState<Blob|null>(null);
    const videoPreviewRef = useRef<HTMLVideoElement>(null);
    const { videoFormat, mimeType, videoBitsPerSecond} = getVideoOptions();
    const [isConnected, setIsConnected] = useState(socket.connected);

    const startRecording = () => {

        setVideoSource(null);


        navigator.mediaDevices.getUserMedia({
            video: { 
                width: { ideal: 640 }, // Lower width
                height: { ideal: 360 }, // Lower height
                frameRate: { ideal: 30, max: 30, min: 15 },
                facingMode: 'user',
                aspectRatio: 9 / 16
            },
            audio: true
        }).then(async function(microphoneStream:any) {

            microphoneStream.fullcanvas = true;
            microphoneStream.width = videoPreviewRef.current?.getBoundingClientRect()?.width; 
            microphoneStream.height = videoPreviewRef.current?.getBoundingClientRect()?.height; 

            console.log(videoPreviewRef.current?.getBoundingClientRect()?.height);
            if(videoPreviewRef.current) {
                videoPreviewRef.current.srcObject = microphoneStream;
                videoPreviewRef.current.onloadedmetadata = () => {
                    videoPreviewRef.current?.play();
                };
            }
            
            audioRecordingStream.current = microphoneStream;
            const audio = await base64ToMediaStream(SampleAudio);
            const mixer = new MultiStreamsMixer([microphoneStream, audio]);
            const mixed = mixer.getMixedStream();

            mixer.frameInterval = 1;
            mixer.startDrawingFrames();

            recorderRef.current = new RecordRTCPromisesHandler(mixed, {
                recorderType: RecordRTC.MediaStreamRecorder,
                type: 'video',
                mimeType,
                bitsPerSecond: videoBitsPerSecond,
                timeSlice: 10000,
                ondataavailable: async (blob:Blob) => {
                    const arrayb = await blob.arrayBuffer();
                    // socket.emit("stream", arrayb);
                    console.log('::', arrayb);
                }
                // disableLogs: true
            });

            recorderRef.current.startRecording();
            
            recorderRef.current.getState().then((state) => console.log('state changed', state))
        });

    }

    
    const stopRecording = () => {

        recorderRef.current?.getState().then((state) => console.log('state changed', state))
        
        recorderRef.current?.stopRecording().then(() => {
            socket.emit("stream.stop");
            setVideoSource(recorderRef.current?.blob as Blob);
            console.log(videoFormat);
            audioRecordingStream.current?.getTracks().forEach((track) => {
                track.stop();
            });

        })
    }

    const onPause = () => {
        recorderRef.current?.pauseRecording().then(()=> console.log('recording pause'))
    }

    const onResume = () => {
        recorderRef.current?.resumeRecording().then(()=> console.log('recording resume'))
    }

    const downlaodZip = () => {
        zipFile(`videofile.${videoFormat}`, videoSource as Blob);
    }

    useEffect(() => {
        function onConnect() {
          setIsConnected(true);
        }
    
        function onDisconnect() {
          setIsConnected(false);
        }
    
        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);
    
        return () => {
          socket.off('connect', onConnect);
          socket.off('disconnect', onDisconnect);
        };
    }, []);

    return (
        <div className='w-screen h-screen flex items-center justify-center flex-col'>
            <div className='flex gap-3'>
                <button onClick={startRecording}>Start Recording</button>
                <button onClick={onPause}>Pause Recording</button>
                <button onClick={onResume}>Resume Recording</button>
                <button onClick={stopRecording}>Stop Recording</button>
                <button onClick={downlaodZip}>Download Zip</button>
            </div>
            <div className='w-[640px] h-[360px] bg-slate-100 mt-5'>
                <video ref={videoPreviewRef} className='w-full h-full' muted playsInline/>
            </div>
            <div className='w-[640px] h-[360px] aspect-video-potrait bg-slate-600 mt-5'>
                {
                    videoSource ? <video controls src={URL.createObjectURL(videoSource as Blob)} className='w-full h-full aspect-video-potrait' /> : null
                }
            </div>
        </div>
    )
}
