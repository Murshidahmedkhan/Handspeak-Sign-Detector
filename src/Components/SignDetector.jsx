import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import * as handPoseDetection from "@mediapipe/hands";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";

export default function SignDetector() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [output, setOutput] = useState("Waiting for sign...");
  const [isCameraActive, setIsCameraActive] = useState(false); // State to track if the camera is active
  const handsRef = useRef(null); // Ref to hold the Hands object

  useEffect(() => {
    async function initializeHands() {
      try {
        // Initialize MediaPipe Hands
        handsRef.current = new handPoseDetection.Hands({
          locateFile: (file) =>
            `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
        });

        handsRef.current.setOptions({
          maxNumHands: 1,
          modelComplexity: 1,
          minDetectionConfidence: 0.7,
          minTrackingConfidence: 0.7,
        });

        handsRef.current.onResults(onResults);

        const interval = setInterval(() => {
          detect();
        }, 100);

        return () => {
          clearInterval(interval);
          if (handsRef.current) {
            handsRef.current.close(); // Clean up the Hands object
          }
        };
      } catch (error) {
        console.error("Error initializing MediaPipe Hands:", error);
        setOutput("Error initializing hand detection.");
      }
    }

    if (isCameraActive) {
      initializeHands();
    }

    // Cleanup function to avoid memory leaks
    return () => {
      if (handsRef.current) {
        handsRef.current.close();
      }
    };
  }, [isCameraActive]); // Re-run when camera state changes

  const detect = async () => {
    if (
      webcamRef.current &&
      webcamRef.current.video.readyState === 4 &&
      handsRef.current
    ) {
      await handsRef.current.send({ image: webcamRef.current.video });
    }
  };

  const onResults = (results) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (!webcamRef.current || !canvas) {
      return;
    }

    canvas.width = webcamRef.current.video.videoWidth;
    canvas.height = webcamRef.current.video.videoHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
      for (const landmarks of results.multiHandLandmarks) {
        drawConnectors(ctx, landmarks, handPoseDetection.HAND_CONNECTIONS, {
          color: "#00FF00",
          lineWidth: 4,
        });
        drawLandmarks(ctx, landmarks, {
          color: "#FF0000",
          lineWidth: 2,
        });

        // 🚧 Placeholder: Replace this with actual API call to backend
        setOutput("Sign Detected: ✌️ (Peace)");
      }
    } else {
      setOutput("Waiting for sign...");
    }
  };

  // Handle start/stop camera action
  const toggleCamera = () => {
    if (isCameraActive) {
      setIsCameraActive(false);
      setOutput("Camera Stopped");
    } else {
      setIsCameraActive(true);
      setOutput("Camera Started, Waiting for Sign...");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white flex flex-col lg:flex-row items-center justify-center p-6 gap-10">
      {/* Left side: Webcam feed */}
      <div className="relative w-full lg:w-[45%] max-w-lg aspect-video rounded-xl overflow-hidden bg-gray-900 flex items-center justify-center">
        {isCameraActive ? (
          <>
            <Webcam
              ref={webcamRef}
              className="rounded-xl absolute"
              videoConstraints={{ facingMode: "user" }}
            />
            <canvas ref={canvasRef} className="absolute top-0 left-0 rounded-xl" />
          </>
        ) : (
          <div className="text-center text-gray-300">Camera Disabled</div>
        )}
      </div>

      {/* Right side: Output and Camera control */}
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
          {output}
        </div>

        {/* Card for displaying API Output */}
        <div className="w-full p-4 bg-gray-700 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-gray-300">API Output</h2>
          <div className="mt-2 text-gray-200">
            <p>Sign Detected: ✌️ (Peace)</p>
            <p>Additional Info: Static data here for now.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
