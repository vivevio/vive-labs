// @ts-ignore
import MultiStreamsMixer from 'multistreamsmixer';
import { useEffect, useMemo, useRef, useState } from 'react';
import useVideoRecorder from '@/hooks/useVideoRecorder';
import useAudioRecordingService from '@/hooks/useAudioRecordingService';
import { LoaderCircle, Mic } from 'lucide-react';
import { RecordingScene } from '@/types/video-recording.type';
import useAudioRecorder from '@/hooks/useAudioRecorder';
import { socket } from '@/services/socket';

export default function VideoRecording() {

    // const audioRecordingStream = useRef<MediaStream|null>(null);
    // const [videoSource, setVideoSource] = useState<Blob|null>(null);
    const videoPreviewRef = useRef<HTMLVideoElement>(null);
    const { audio } = useAudioRecordingService();
    const [scene, setScene] = useState<RecordingScene>('default');
    // const [isConnected, setIsConnected] = useState(socket.connected);
    const [videoPreview, setVideoPreview] = useState('');

    const audioPlayer = useMemo(()=>{
        if(audio.url) return new Audio(audio.url);
        return null;
    }, [audio.url])

    const onDataStreamChanged = async (blob:Blob) => {
        const arrayb = await blob.arrayBuffer();
        socket.emit('stream.update', arrayb);
    }

    const { startRecording, videoConfig, isRecording,
        isPreparing, stopRecording, mediaStream
    } = useVideoRecorder({
        videoPreviewRef,
        audioScriptBuffer: audio.buffer,
        onDataStreamChanged
    });

    const AudioRecorder = useAudioRecorder();

    const onStartRecording = () => {

        if(isRecording) return;

        if(audioPlayer) {
            socket.connect();
            startRecording(() => {
                setVideoPreview('');
                setScene('recording');
                audioPlayer?.play();
            });

            audioPlayer?.addEventListener('ended', () => {
                setScene('user-answer');
            })
        }
    }

    const onStartUserAnswer = () => {

        if(AudioRecorder.isRecording) {
            return AudioRecorder.stopRecording((result) => {
                // console.log(`audio:`, URL.createObjectURL(result.blob));
                stopRecording(res => {
                    // console.log(`video: `, URL.createObjectURL(res.blob));
                    socket.emit('stream.stop', {
                        format: videoConfig.videoFormat,
                        mime: videoConfig.mimeType,
                        spaj: '210080032'
                    });
                    // socket.disconnect();
                    setVideoPreview(URL.createObjectURL(res.blob))
                    setScene('result');
                });
            })
        }

        AudioRecorder.startRecording(mediaStream);
    }

    const ButtonState = () => {
        if(scene === 'default') {
            return (
                <button disabled={isPreparing || isRecording} className='bg-blue-800 text-white font-medium p-3 rounded-md' onClick={onStartRecording}>
                    { isPreparing && <span className='flex gap-1 items-center justify-center'><LoaderCircle className='animate-spin'/> Preparing...</span> }
                    { !isRecording && !isPreparing ? 'Start Recording' : '' }
                </button>
            )
        }

        if(scene === 'user-answer') {
            return (
                <button disabled={AudioRecorder.isPreparing} className='bg-blue-800 text-white font-medium p-3 rounded-md flex gap-1 items-center justify-center' onClick={onStartUserAnswer}>
                    { AudioRecorder.isPreparing && <span className='flex gap-1 items-center justify-center'><LoaderCircle className='animate-spin'/> Preparing...</span> }
                    { !AudioRecorder.isRecording && !AudioRecorder.isPreparing ? <><Mic /> Give Answer</> : '' }
                    { AudioRecorder.isRecording && !AudioRecorder.isPreparing ? <>Submit Answer</> : '' }
                </button>
            )
        }

        return null;
    }

    useEffect(() => {
        // previewCamera();
    },[]);

    useEffect(() => {


        function onConnect() {
            console.log('connected');
        }
    
        function onDisconnect() {
            console.log('disconected')
        }

        function onError(e:any) {
            console.log('error:', e.message);
        }
    
        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);
        socket.on('connect_error', onError);

        return () => {
          socket.off('connect', onConnect);
          socket.off('disconnect', onDisconnect);
          socket.off('connect_error', onError);
        };
    }, []);

    return (
        <div className='w-full sm:w-[390px] mx-auto h-screen md:h-full relative'>
            <h2 className='text-center font-bold text-[18px] pt-5 mb-3'>Video Recording</h2>

            <div className='bg-slate-200 relative sm:rounded-md overflow-hidden aspect-video-potrait lg:aspect-video mx-auto'>
                { scene !== 'result' && <video ref={videoPreviewRef} className='w-full h-full sm:rounded-md aspect-video-potrait lg:aspect-video' muted playsInline/> }
                { scene === 'result' && <video src={videoPreview} className='w-full h-full sm:rounded-md aspect-video-potrait lg:aspect-video' controls playsInline/> }
            </div>

            <div className='sticky w-fit mx-auto -bottom-[10px] mt-5'>
                <ButtonState />
            </div>
            {/* <div className='flex gap-3'>
                <button onClick={startRecording}>Start Recording</button>
                <button onClick={onPause}>Pause Recording</button>
                <button onClick={onResume}>Resume Recording</button>
                <button onClick={stopRecording}>Stop Recording</button>
                <button onClick={downlaodZip}>Download Zip</button>
            </div>
            <div className='w-[640px] h-[360px] bg-slate-100 mt-5'>
                <video ref={videoPreviewRef} className='w-full h-full' muted playsInline/>
            </div>
            <div className='w-[640px] h-[360px] bg-slate-600 mt-5'>
                {
                    videoSource ? <video controls src={URL.createObjectURL(videoSource as Blob)} className='w-full h-full' /> : null
                }
            </div> */}
        </div>
    )
}
