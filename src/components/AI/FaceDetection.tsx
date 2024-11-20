import React, { useRef, useEffect, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';
import { MediaPipeFaceDetectorMediaPipe } from '@tensorflow-models/face-landmarks-detection/dist/types';

interface FaceDetectionProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  enabled: boolean;
  onFacesDetected?: (faces: any[]) => void;
}

export const FaceDetection: React.FC<FaceDetectionProps> = ({ 
  videoRef, 
  enabled, 
  onFacesDetected 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [detector, setDetector] = useState<MediaPipeFaceDetectorMediaPipe | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [metrics, setMetrics] = useState({
    fps: 0,
    latency: 0,
    confidence: 0
  });

  useEffect(() => {
    const initializeDetector = async () => {
      await tf.setBackend('webgl');
      const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceDetector;
      const detector = await faceLandmarksDetection.createDetector(model, {
        runtime: 'mediapipe',
        refineLandmarks: true,
        maxFaces: 4,
      });
      setDetector(detector);
    };

    initializeDetector();
  }, []);

  useEffect(() => {
    if (!enabled || !detector || !videoRef.current || !canvasRef.current) return;

    let animationFrame: number;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const detectFaces = async () => {
      if (!videoRef.current || !canvasRef.current || isProcessing) return;
      setIsProcessing(true);

      const startTime = performance.now();

      try {
        const faces = await detector.estimateFaces(videoRef.current);
        
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        ctx.drawImage(
          videoRef.current,
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        );

        faces.forEach((face: any) => {
          const { topLeft, bottomRight, landmarks } = face;

          // Draw face rectangle
          ctx.strokeStyle = '#00ff00';
          ctx.lineWidth = 2;
          ctx.strokeRect(
            topLeft[0],
            topLeft[1],
            bottomRight[0] - topLeft[0],
            bottomRight[1] - topLeft[1]
          );

          // Draw landmarks
          ctx.fillStyle = '#00ff00';
          landmarks.forEach((point: number[]) => {
            ctx.beginPath();
            ctx.arc(point[0], point[1], 2, 0, 2 * Math.PI);
            ctx.fill();
          });
        });

        const endTime = performance.now();
        setMetrics({
          fps: Math.round(1000 / (endTime - startTime)),
          latency: Math.round(endTime - startTime),
          confidence: faces.length > 0 ? Math.round(faces[0].score * 100) : 0
        });

        if (onFacesDetected) {
          onFacesDetected(faces);
        }
      } catch (error) {
        console.error('Face detection error:', error);
      }

      setIsProcessing(false);
      animationFrame = requestAnimationFrame(detectFaces);
    };

    detectFaces();

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [detector, enabled, videoRef, onFacesDetected, isProcessing]);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        width={videoRef.current?.videoWidth || 640}
        height={videoRef.current?.videoHeight || 480}
      />
      <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white p-2 rounded text-sm">
        <div>FPS: {metrics.fps}</div>
        <div>Latency: {metrics.latency}ms</div>
        <div>Confidence: {metrics.confidence}%</div>
      </div>
    </>
  );
};