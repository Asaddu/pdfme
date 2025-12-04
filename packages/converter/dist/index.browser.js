import * as pdfjsLib from 'pdfjs-dist';
// @ts-expect-error - Vite ?url suffix returns the URL path to the worker file
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { pdf2img as _pdf2img } from './pdf2img.js';
import { pdf2size as _pdf2size } from './pdf2size.js';
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;
function dataURLToArrayBuffer(dataURL) {
    // Split out the actual base64 string from the data URL scheme
    const base64String = dataURL.split(',')[1];
    // Decode the Base64 string to get the binary data
    const byteString = atob(base64String);
    // Create a typed array from the binary string
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uintArray = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
        uintArray[i] = byteString.charCodeAt(i);
    }
    return arrayBuffer;
}
export const pdf2img = async (pdf, options = {}) => _pdf2img(pdf, options, {
    getDocument: (pdf) => pdfjsLib.getDocument({ data: pdf, isEvalSupported: false }).promise,
    createCanvas: (width, height) => {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        return canvas;
    },
    canvasToArrayBuffer: (canvas, imageType) => {
        // Using type assertion to handle the canvas method
        const dataUrl = canvas.toDataURL(`image/${imageType}`);
        return dataURLToArrayBuffer(dataUrl);
    },
});
export const pdf2size = async (pdf, options = {}) => _pdf2size(pdf, options, {
    getDocument: (pdf) => pdfjsLib.getDocument({ data: pdf, isEvalSupported: false }).promise,
});
export { img2pdf } from './img2pdf.js';
//# sourceMappingURL=index.browser.js.map