import React, { useRef, useState, useEffect } from 'react';
import { Camera, StopCircle, Video, Mic, Settings } from 'lucide-react';
import { FaceDetection } from '../AI/FaceDetection';

export const VideoRecorder: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [faceDetectionEnabled, setFaceDetectionEnabled] = useState(false);
  const [settings, setSettings] = useState({
    video: {
      width: { ideal: 1920 },
      height: { ideal: 1080 },
      facingMode: 'user'
    },
    audio: true
  });

  const startRecording = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia(settings);
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }

      const mediaRecorder = new MediaRecorder(mediaStream);
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setRecordedChunks((prev) => [...prev, event.data]);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing media devices:', error);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    stream?.getTracks().forEach(track => track.stop());
    setIsRecording(false);
  };

  useEffect(() => {
    if (recordedChunks.length > 0) {
      const blob = new Blob(recordedChunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      // Handle the recorded video URL here
    }
  }, [recordedChunks]);

  return (
    <div className="flex flex-col space-y-4 p-6 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Video Recorder</h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setFaceDetectionEnabled(!faceDetectionEnabled)}
            className={`p-2 rounded-lg ${
              faceDetectionEnabled ? 'bg-blue-100 text-blue-600' : 'bg-gray-100'
            }`}
          >
            <Camera className="w-5 h-5" />
          </button>
          <button className="p-2 rounded-lg bg-gray-100">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />
        {faceDetectionEnabled && (
          <FaceDetection
            videoRef={videoRef}
            enabled={faceDetectionEnabled}
            onFacesDetected={console.log}
          />
        )}
      </div>

      <div className="flex justify-center space-x-4">
        {!isRecording ? (
          <button
            onClick={startRecording}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Video className="w-5 h-5" />
            <span>Start Recording</span>
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            <StopCircle className="w-5 h-5" />
            <span>Stop Recording</span>
          </button>
        )}
      </div>
    </div>
  );
};