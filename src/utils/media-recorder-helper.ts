import VideoRecordingServices from "@/services/video-recording.services";

declare global {
	interface Window {
		webkitAudioContext: typeof AudioContext;
	}
}

export function convertBase64ToBlob(base64: string, type: string): Blob {
	const binaryData = atob(base64);

	const uint8Array = new Uint8Array(binaryData.length);
	for (let i = 0; i < binaryData.length; i++) {
		uint8Array[i] = binaryData.charCodeAt(i);
	}

	return new Blob([uint8Array], { type });
}

export function convertBase64ToBuffer(base64: string): ArrayBuffer {
	const binaryData = atob(base64);

	const uint8Array = new Uint8Array(binaryData.length);
	for (let i = 0; i < binaryData.length; i++) {
		uint8Array[i] = binaryData.charCodeAt(i);
	}

	return uint8Array.buffer;
}

export async function arrayBufferToAudioBuffer(
	arrayBuffer: ArrayBuffer,
	audioContext: AudioContext
): Promise<AudioBuffer> {
	return await audioContext.decodeAudioData(arrayBuffer);
}

export async function audioBufferToMediaStream(
	audioBuffer: AudioBuffer,
	audioContext: AudioContext
): Promise<MediaStream> {
	const source = audioContext.createBufferSource();
	source.buffer = audioBuffer;

	const destination = audioContext.createMediaStreamDestination();
	source.connect(destination);
	source.start(0);

	return destination.stream;
}

export async function base64ToMediaStream(
	base64Audio: string
): Promise<MediaStream> {
	const arrayBuffer = convertBase64ToBuffer(base64Audio);
	const audioContext = new (window.AudioContext || window.webkitAudioContext)();

	const audioBuffer = await arrayBufferToAudioBuffer(arrayBuffer, audioContext);
	const mediaStream = await audioBufferToMediaStream(audioBuffer, audioContext);

	return mediaStream;
}


interface VideoOptions {
    mimeType: | "audio/webm"
	| "audio/webm;codecs=pcm"
	| "video/mp4"
	| "video/webm"
	| "video/webm;codecs=vp9"
	| "video/webm;codecs=vp8"
	| "video/webm;codecs=h264"
	| "video/x-matroska;codecs=avc1"
	| "video/mpeg"
	| "audio/wav"
	| "audio/ogg";
    videoBitsPerSecond: number;
    videoFormat: string;
}

export function getVideoOptions() : VideoOptions {

    const videoBitsPerSecond = 200_000;

	if (MediaRecorder.isTypeSupported("video/webm;codecs=vp9")) {
		return {
			mimeType: "video/webm;codecs=vp9",
			videoBitsPerSecond,
            videoFormat: 'webm'
		};
	}
    
    if (MediaRecorder.isTypeSupported("video/webm")) {
        return {
            mimeType: "video/webm;codecs=vp8",
			videoBitsPerSecond,
            videoFormat: 'webm'
        }
		
	}
    
    if (MediaRecorder.isTypeSupported("video/mp4;codecs:h264")) {
		return {
			mimeType: "video/mp4",
			videoBitsPerSecond,
            videoFormat: 'mp4'
		};
	}
    
    
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (isIOS) {
        return {
            mimeType: "video/mp4",
            videoBitsPerSecond,
            videoFormat: 'mp4'
        };
    }

	return {
        mimeType: "video/webm;codecs=vp8",
        videoBitsPerSecond,
        videoFormat: 'mp4'
    };
}


export async function combineAudioBase64(listAudio:Array<any>, covidFlag=0) {
	const audioList: Array<Blob> = [];

    // combining audio list
    for (let i = 0; i < listAudio.length; i++) {
      const robotAudio = listAudio[i];
      const robotBase46 = robotAudio.base64;
      const isLastIndex = i + 1 === listAudio.length;

      if (robotBase46 !== "-" && robotBase46 && robotBase46.length >= 30) {
        const binaryData = atob(`${robotBase46}`);

        // Create a Uint8Array from the binary data
        const uint8Array = new Uint8Array(binaryData.length);
        for (let i = 0; i < binaryData.length; i++) {
          uint8Array[i] = binaryData.charCodeAt(i);
        }

        // Create a Blob from the Uint8Array
        const blob = new Blob([uint8Array], { type: "audio/wav" });
        if (!isLastIndex || covidFlag !== 0) {
          audioList.push(blob);
        }
      }
    }

	return VideoRecordingServices.combineAudioBlob(audioList);
}

export function bufferToBlob(buffer: AudioBuffer): Blob {
	const numberOfChannels = buffer.numberOfChannels;
	const length = buffer.length * numberOfChannels * 2 + 44;
	const bufferView = new ArrayBuffer(length);
	const int8View = new Int8Array(bufferView);
	const dataView = new DataView(bufferView);
  
	const channels = [];
	for (let channel = 0; channel < numberOfChannels; channel++) {
	  channels.push(buffer.getChannelData(channel));
	}
  
	let index = 0;
	const writeString = (string: string) => {
	  for (let i = 0; i < string.length; i++) {
		int8View[index++] = string.charCodeAt(i);
	  }
	};
  
	// RIFF header
	writeString("RIFF");
	dataView.setUint32(index, length - 8, true);
	index += 4;
	writeString("WAVE");
  
	// Format chunk
	writeString("fmt ");
	dataView.setUint32(index, 16, true);
	index += 4;
	dataView.setUint16(index, 1, true); // PCM format
	index += 2;
	dataView.setUint16(index, numberOfChannels, true);
	index += 2;
	dataView.setUint32(index, buffer.sampleRate, true);
	index += 4;
	dataView.setUint32(index, buffer.sampleRate * numberOfChannels * 2, true);
	index += 4;
	dataView.setUint16(index, numberOfChannels * 2, true); // Block align
	index += 2;
	dataView.setUint16(index, 16, true); // Bits per sample
	index += 2;
  
	// Data chunk
	writeString("data");
	dataView.setUint32(index, length - index - 4, true);
	index += 4;
  
	// Write audio data
	for (let channel = 0; channel < numberOfChannels; channel++) {
	  const channelData = channels[channel];
	  for (let i = 0; i < channelData.length; i++) {
		const sample = Math.max(-1, Math.min(1, channelData[i]));
		const sampleValue = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
		dataView.setInt16(index, sampleValue, true);
		index += 2;
	  }
	}
  
	return new Blob([bufferView], { type: "audio/wav" });
}

export function getAspectRatio(width:number|null, height:number|null) {
	if(width !== null && height !== null) {
		if(width < height) return 9 / 16;
		return 16 / 9;
	}

	return 9 / 16;
}
