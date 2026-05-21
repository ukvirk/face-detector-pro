import { FaceDetector, FilesetResolver } from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest";

const video = document.getElementById("webcam");
const canvas = document.getElementById("output");
const ctx = canvas.getContext("2d");

async function initConverterPro() {
    console.log("Converter Pro: Initializing Vision Pipeline...");

    // Initialize WASM assets
    const vision = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm");
    const detector = await FaceDetector.createFromOptions(vision, {
        baseOptions: { modelAssetPath: "https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite" },
        runningMode: "VIDEO"
    });

    // Access Camera
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    video.srcObject = stream;

    video.addEventListener("loadedmetadata", () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        predictLoop(detector);
    });
}

function predictLoop(detector) {
    const startTime = performance.now();
    const detections = detector.detectForVideo(video, startTime);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (detections.detections.length > 0) {
        ctx.strokeStyle = "#8a2be2";
        ctx.lineWidth = 4;
        detections.detections.forEach(d => {
            const { originX, originY, width, height } = d.boundingBox;
            ctx.strokeRect(originX, originY, width, height);
        });
    }
    requestAnimationFrame(() => predictLoop(detector));
}

initConverterPro();