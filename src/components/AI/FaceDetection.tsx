import React, { useRef, useEffect, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';
import type { Face, FaceDetector, Keypoint } from '@tensorflow-models/face-landmarks-detection';

export interface DetectedFace {
  topLeft: [number, number];
  bottomRight: [number, number];
  landmarks: number[][];
  score?: number;
}

interface FaceDetectionProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  enabled: boolean;
  onFacesDetected?: (faces: DetectedFace[]) => void;
}

export const FaceDetection: React.FC<FaceDetectionProps> = ({ 
  videoRef, 
  enabled, 
  onFacesDetected 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [detector, setDetector] = useState<FaceDetector | null>(null);
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
      const det = await faceLandmarksDetection.createDetector(model, {
        runtime: 'mediapipe',
        refineLandmarks: true,
        maxFaces: 4,
      });
      setDetector(det);
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
        const faces = await detector.estimateFaces(videoRef.current) as Face[];
        
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        ctx.drawImage(
          videoRef.current,
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        );

        const allKeypoints: Keypoint[] = [];
        
        faces.forEach((face: Face) => {
          const box = face.box;
          const keypoints = face.keypoints as Keypoint[];

          if (keypoints) {
            allKeypoints.push(...keypoints);
          }

          if (box) {
            ctx.strokeStyle = '#00ff00';
            ctx.lineWidth = 2;
            const startX = box.xMin ?? 0;
            const startY = box.yMin ?? 0;
            const width = (box.xMax ?? 0) - startX;
            const height = (box.yMax ?? 0) - startY;
            ctx.strokeRect(startX, startY, width, height);
          }
        });

        allKeypoints.forEach((point: Keypoint) => {
          ctx.fillStyle = '#00ff00';
          ctx.beginPath();
          ctx.arc(point.x ?? 0, point.y ?? 0, 2, 0, 2 * Math.PI);
          ctx.fill();
        });

        const endTime = performance.now();
        setMetrics({
          fps: Math.round(1000 / (endTime - startTime)),
          latency: Math.round(endTime - startTime),
          confidence: faces.length > 0 ? Math.round((faces[0].score ?? 0) * 100) : 0
        });

        if (onFacesDetected) {
          const detectedFaces: DetectedFace[] = faces.map((face: Face) => ({
            topLeft: face.box ? [face.box.xMin ?? 0, face.box.yMin ?? 0] : [0, 0],
            bottomRight: face.box ? [face.box.xMax ?? 0, face.box.yMax ?? 0] : [0, 0],
            landmarks: face.keypoints ? (face.keypoints as Keypoint[]).map((p: Keypoint) => [p.x ?? 0, p.y ?? 0]) : [],
            score: face.score
          }));
          onFacesDetected(detectedFaces);
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