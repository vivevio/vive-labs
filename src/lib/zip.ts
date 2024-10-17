import JSZip from "jszip";

export function zipFile(filename: string, blob: Blob) {
	var zip = new JSZip();

	zip.file(filename, blob);
	zip.generateAsync({ type: "blob" }).then(
		function (res) {
			// (window.location as any) = "data:application/zip;base64," + base64;
            downloadBlob(res, 'sample-file.zip')
		},
		function (err) {
			console.log(err);
		}
	);
}

function downloadBlob(blob: Blob, filename: string): void {
	const url = window.URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.href = url;
	link.download = filename;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
	window.URL.revokeObjectURL(url);
}
