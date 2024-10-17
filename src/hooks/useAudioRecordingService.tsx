import VideoRecordingServices from "@/services/video-recording.services"
import { arrayBufferToAudioBuffer, audioBufferToMediaStream, combineAudioBase64 } from "@/utils/media-recorder-helper";
import { useEffect, useState } from "react";

interface AudioOptions {
    buffer: AudioBuffer | null;
    url: string | null;
}

export default function useAudioRecordingService() {

    const [audio, setAudio] = useState<AudioOptions>({ buffer: null, url: null });

    const getAudioList = async () => {
        try {
            const res:any = await VideoRecordingServices.getAudioList();
            if(res.status === 200) {
                const audioList:Array<any> = res.data.data;
                const proccessAudio = await combineAudioBase64(audioList, 1);
                setAudio({buffer: proccessAudio.audioBuffer, url: URL.createObjectURL(proccessAudio.audioBlob)});
                return;
            }
        } catch ( error ) {

        }
    }

    useEffect(() => {
        getAudioList();
    }, []);

    useEffect(()=>{
        return () => {
            if(audio.url !== null) {
                URL.revokeObjectURL(audio.url);
            }
        }
    }, [audio.url])


    return {
        getAudioList,
        audio
    }
}
