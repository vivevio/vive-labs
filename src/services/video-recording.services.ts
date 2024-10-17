import { bufferToBlob } from "@/utils/media-recorder-helper";
import axios from "axios";

function getAudioList(): Promise<any> {
	return axios.get("/audio-script.json");
}

async function combineAudioBlob(files: Blob[]) : Promise<{audioBuffer:AudioBuffer, audioBlob:Blob}> {
	const audioContext = new window.AudioContext();
	const audioBuffers: AudioBuffer[] = [];

	const loadFile = async (fileBlob: Blob): Promise<AudioBuffer> => {
		const file = new File([fileBlob], `audio.wav`, {
			lastModified: new Date().getTime(),
		});
		const arrayBuffer = await file.arrayBuffer();
		return await audioContext.decodeAudioData(arrayBuffer);
	};

	const combineBuffers = () => {
		const totalLength = audioBuffers.reduce(
			(total, buffer) => total + buffer.length,
			0
		);
		const combinedBuffer = audioContext.createBuffer(
			1, // Mono channel
			totalLength,
			audioBuffers[0].sampleRate
		);

		let offset = 0;
		audioBuffers.forEach((buffer) => {
			combinedBuffer.getChannelData(0).set(buffer.getChannelData(0), offset);
			offset += buffer.length;
		});

		return combinedBuffer;
	};

	const buffers = await Promise.all(files.map(loadFile));
    audioBuffers.push(...buffers);
    const combinedBuffer = combineBuffers();
    const audioBlob = bufferToBlob(combinedBuffer);

    return {
        audioBuffer: combinedBuffer,
        audioBlob
    }
}
		

const VideoRecordingServices = {
	getAudioList,
    combineAudioBlob
};

export default VideoRecordingServices;
