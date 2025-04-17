import React, { useEffect, useRef, useState } from 'react';

const SignDetector = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const socketRef = useRef(null);

  const [predictedText, setPredictedText] = useState('');
  const [isCameraActive, setIsCameraActive] = useState(true);
  const [sequenceBuffer, setSequenceBuffer] = useState([]);

  // WebSocket Setup
  useEffect(() => {
    socketRef.current = new WebSocket('ws://127.0.0.1:8000/ws/predict/');
    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.prediction) {
        console.log('safdasdf', data.prediction);
        setPredictedText(data.prediction);
      }
    };
    return () => socketRef.current.close();
  }, []);

  const extractKeypoints = (landmarks) => {
    return landmarks.flatMap((lm) => [lm.x, lm.y, lm.z]);
  };

  // Handle drawing and sending keypoints
  const onResults = (results) => {
    const canvasCtx = canvasRef.current.getContext('2d');
    canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    canvasCtx.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);

    if (results.poseLandmarks) {
      window.drawConnectors(canvasCtx, results.poseLandmarks, window.POSE_CONNECTIONS, { color: '#00FF00', lineWidth: 4 });
      window.drawLandmarks(canvasCtx, results.poseLandmarks, { color: '#FF0000', lineWidth: 2 });
    }
    if (results.leftHandLandmarks) {
      window.drawConnectors(canvasCtx, results.leftHandLandmarks, window.HAND_CONNECTIONS, { color: '#00CCFF', lineWidth: 4 });
      window.drawLandmarks(canvasCtx, results.leftHandLandmarks, { color: '#FF0000', lineWidth: 2 });
    }
    if (results.rightHandLandmarks) {
      window.drawConnectors(canvasCtx, results.rightHandLandmarks, window.HAND_CONNECTIONS, { color: '#00CCFF', lineWidth: 4 });
      window.drawLandmarks(canvasCtx, results.rightHandLandmarks, { color: '#FF0000', lineWidth: 2 });
    }

    const pose = results.poseLandmarks ? extractKeypoints(results.poseLandmarks) : new Array(99).fill(0);
    const face = results.faceLandmarks ? extractKeypoints(results.faceLandmarks) : new Array(1404).fill(0);
    const leftHand = results.leftHandLandmarks ? extractKeypoints(results.leftHandLandmarks) : new Array(63).fill(0);
    const rightHand = results.rightHandLandmarks ? extractKeypoints(results.rightHandLandmarks) : new Array(63).fill(0);

    let keypoints = [...pose, ...face, ...leftHand, ...rightHand];
    while (keypoints.length < 1662) keypoints.push(0);

    console.log("Keypoints length per frame:", keypoints.length);

    // Update sequence buffer and send when full
    setSequenceBuffer(prev => {
      const updated = [...prev, keypoints];
      if (updated.length === 30) {
        console.log('gaya',updated)
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
          console.log('gayapp')
          socketRef.current.send(JSON.stringify({ sequence: updated }));
        }
        return []; // reset buffer
      }
      return updated;
    });
  };

  // Holistic setup
  useEffect(() => {
    const holistic = new window.Holistic({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`
    });

    holistic.setOptions({
      // modelComplexity: 1,
      // smoothLandmarks: true,
      // enableSegmentation: false,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    });

    holistic.onResults(onResults);

    if (typeof window.Camera !== 'undefined') {
      const camera = new window.Camera(videoRef.current, {
        onFrame: async () => {
          await holistic.send({ image: videoRef.current });
        },
        width: 640,
        height: 480,
      });
      if (isCameraActive) camera.start();
    }
  }, [isCameraActive]);

  const toggleCamera = () => {
    setIsCameraActive(prev => !prev);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white flex flex-col lg:flex-row items-center justify-center p-6 gap-10">
      {/* Left: Video feed & Canvas */}
      <div className="relative w-full lg:w-[45%] max-w-lg aspect-video rounded-xl overflow-hidden bg-gray-900 flex items-center justify-center">
        {isCameraActive ? (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="absolute top-0 left-0 w-full h-full object-cover rounded-xl scale-x-[-1]"
              width="640"
              height="480"
            />
            <canvas
              ref={canvasRef}
              className="absolute top-0 left-0 w-full h-full rounded-xl scale-x-[-1]"
              width="640"
              height="480"
            />
          </>
        ) : (
          <div className="text-center text-gray-300">Camera Disabled</div>
        )}
      </div>

      {/* Right: Prediction & Info */}
      <div className="w-full lg:w-[45%] max-w-lg bg-gray-800 rounded-xl p-6 shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-violet-500">HandSpeak Detection</h1>
          <button
            onClick={toggleCamera}
            className="bg-violet-500 text-white py-2 px-4 rounded-lg hover:bg-violet-600 transition"
          >
            {isCameraActive ? "Stop Camera" : "Start Camera"}
          </button>
        </div>

        <div className="text-xl font-medium text-center text-gray-300 bg-white/10 px-4 py-2 rounded-lg backdrop-blur mb-6">
          {predictedText || "Waiting for prediction..."}
        </div>

        <div className="w-full p-4 bg-gray-700 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-gray-300">API Output</h2>
          <div className="mt-2 text-gray-200">
            <p>Sign Detected: {predictedText || "N/A"}</p>
            <p>Additional Info: Static data here for now.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignDetector;
