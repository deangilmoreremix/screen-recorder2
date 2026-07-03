import { useRef, useEffect, useState, type RefObject } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';

interface FaceDetectionProps {
  videoRef: RefObject<HTMLVideoElement>;
  enabled: boolean;
  onFacesDetected?: (faces: unknown[]) => void;
}

export const FaceDetection: React.FC<FaceDetectionProps> = ({
  videoRef,
  enabled,
  onFacesDetected,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [detector, setDetector] = useState<faceLandmarksDetection.FaceLandmarksDetector | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [metrics, setMetrics] = useState({
    fps: 0,
    latency: 0,
    confidence: 0,
  });

  useEffect(() => {
    const initializeDetector = async () => {
      try {
        await tf.setBackend('webgl');
        const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh;
        const detector = await faceLandmarksDetection.createDetector(model, {
          runtime: 'mediapipe',
          refineLandmarks: true,
          maxFaces: 4,
        });
        setDetector(detector);
      } catch (err) {
        console.warn('Face detector initialization failed (mediapipe may be unavailable):', err);
      }
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

        const { width, height } = canvasRef.current;
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(videoRef.current, 0, 0, width, height);

        (faces as Array<{ box?: { xMin: number; yMin: number; width: number; height: number }; keypoints?: Array<{ x: number; y: number; name?: string }> }>).forEach((face) => {
          if (face.box) {
            const { xMin, yMin, width, height } = face.box;
            ctx.strokeStyle = '#00ff00';
            ctx.lineWidth = 2;
            ctx.strokeRect(xMin, yMin, width, height);
          }
          if (face.keypoints) {
            ctx.fillStyle = '#00ff00';
            face.keypoints.forEach((point) => {
              ctx.beginPath();
              ctx.arc(point.x, point.y, 2, 0, 2 * Math.PI);
              ctx.fill();
            });
          }
        });

        const endTime = performance.now();
        setMetrics({
          fps: Math.round(1000 / (endTime - startTime)),
          latency: Math.round(endTime - startTime),
          confidence: 0,
        });

        if (onFacesDetected) {
          onFacesDetected(faces as unknown[]);
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

  const width = videoRef.current?.videoWidth || 640;
  const height = videoRef.current?.videoHeight || 480;

  return (
    <>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        width={width}
        height={height}
      />
      <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white p-2 rounded text-sm">
        <div>FPS: {metrics.fps}</div>
        <div>Latency: {metrics.latency}ms</div>
        <div>Confidence: {metrics.confidence}%</div>
      </div>
    </>
  );
};
