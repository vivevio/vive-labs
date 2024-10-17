declare global {
	interface Window {
		webkitAudioContext: typeof AudioContext;
	}

	interface Navigator {
		webkitGetUserMedia?: (
			constraints: MediaStreamConstraints,
			successCallback: (stream: MediaStream) => void,
			errorCallback: (error: any) => void
		) => void;
		mozGetUserMedia?: (
			constraints: MediaStreamConstraints,
			successCallback: (stream: MediaStream) => void,
			errorCallback: (error: any) => void
		) => void;
		msGetUserMedia?: (
			constraints: MediaStreamConstraints,
			successCallback: (stream: MediaStream) => void,
			errorCallback: (error: any) => void
		) => void;
		getUserMedia?: (
			constraints: MediaStreamConstraints,
			successCallback: (stream: MediaStream) => void,
			errorCallback: (error: any) => void
		) => void;
	}
}

interface CameraPermissionCheckResult {
	status: boolean;
	message: string;
	errorType?: "browser" | "permission";
}

export async function cameraPermissionCheck(): Promise<CameraPermissionCheckResult> {
	const getUserMedia =
		navigator.mediaDevices?.getUserMedia.bind(navigator.mediaDevices) ||
		(
			navigator.getUserMedia ||
			navigator.webkitGetUserMedia ||
			navigator.mozGetUserMedia ||
			navigator.msGetUserMedia
		)?.bind(navigator);

	if (getUserMedia) {
		return getUserMedia({ audio: true, video: true })
			.then((stream: MediaStream) => {
				const videoElement = document.querySelector(
					"video"
				) as HTMLVideoElement;
				if (videoElement) {
					videoElement.srcObject = stream;
				}

				const mediaStreamTrack = stream.getVideoTracks()[0];
				if (mediaStreamTrack) {
					mediaStreamTrack.onended = () => {
						console.log("Your webcam is busy!");
						return Promise.reject({
							status: false,
							message: "Your webcam is busy!",
							errorType: "permission",
						});
					};

					stream.getTracks().forEach((track) => {
						track.stop();
					});

					return Promise.resolve({
						status: true,
						message: "Permission allowed",
					});
				}

				return Promise.reject({
					status: false,
					message: "Permission denied",
					errorType: "permission",
				});
			})
			.catch((e: Error) => {
				let message: string;
				switch (e.name) {
					case "NotFoundError":
					case "DevicesNotFoundError":
						message = "Please set up your webcam first.";
						break;
					case "SourceUnavailableError":
						message = "Your webcam is busy";
						break;
					case "PermissionDeniedError":
					case "SecurityError":
						message = "Permission denied!";
						break;
					default:
						message = "Permission denied!";
						break;
				}

				return Promise.reject({
					status: false,
					message,
					errorType: "permission",
				});
			});
	} else {
		return Promise.reject({
			status: false,
			message: "Incompatible browser!",
			errorType: "browser",
		});
	}
}
