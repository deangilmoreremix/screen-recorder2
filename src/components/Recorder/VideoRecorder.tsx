import React, { useRef, useState, useEffect } from 'react';
import { Camera, StopCircle, Video, Settings, ImageIcon, FileText, BarChart3, Tag, Loader2 } from 'lucide-react';
import { useEditorStore } from '../../store';
import { FaceDetection } from '../AI/FaceDetection';
import { aiImage, openaiResponses } from '../../lib/openai';
import { uploadVideo } from '../../lib/supabase';

type ProcessingStatus = 'pending' | 'processing' | 'complete' | 'error';

export const VideoRecorder: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [faceDetectionEnabled, setFaceDetectionEnabled] = useState(false);
  const [recordingSettings] = useState({
    video: {
      width: { ideal: 1920 },
      height: { ideal: 1080 },
      facingMode: 'user'
    },
    audio: true
  });

  const [thumbnailStatus, setThumbnailStatus] = useState<ProcessingStatus>('pending');
  const [transcriptStatus, setTranscriptStatus] = useState<ProcessingStatus>('pending');
  const [analysisStatus, setAnalysisStatus] = useState<ProcessingStatus>('pending');
  const [metadataStatus, setMetadataStatus] = useState<ProcessingStatus>('pending');

  const setRecordedVideoUrl = useEditorStore((state) => state.setRecordedVideoUrl);
  const recordedVideoUrl = useEditorStore((state) => state.recordedVideoUrl);
  const videoThumbnail = useEditorStore((state) => state.videoThumbnail);
  const videoTranscript = useEditorStore((state) => state.videoTranscript);
  const videoAnalysis = useEditorStore((state) => state.videoAnalysis);
  const videoMetadata = useEditorStore((state) => state.videoMetadata);
  const setVideoThumbnail = useEditorStore((state) => state.setVideoThumbnail);
  const setVideoTranscript = useEditorStore((state) => state.setVideoTranscript);
  const setVideoAnalysis = useEditorStore((state) => state.setVideoAnalysis);
  const setVideoMetadata = useEditorStore((state) => state.setVideoMetadata);
  const setThumbnailsGenerating = useEditorStore((state) => state.setThumbnailsGenerating);

  const startRecording = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia(recordingSettings);
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

  const generateThumbnail = async () => {
    if (!recordedVideoUrl) return;
    setThumbnailStatus('processing');
    try {
      setThumbnailsGenerating(true);
      const thumbnailUrl = await aiImage.generateYouTubeThumbnail(recordedVideoUrl);
      setVideoThumbnail(thumbnailUrl);
      setThumbnailStatus('complete');
    } catch (error) {
      console.error('Thumbnail generation failed:', error);
      setThumbnailStatus('error');
    } finally {
      setThumbnailsGenerating(false);
    }
  };

  const generateTranscript = async () => {
    if (!recordedVideoUrl) return;
    setTranscriptStatus('processing');
    try {
      const transcript = await openaiResponses.transcribeMedia(recordedVideoUrl);
      setVideoTranscript(transcript.transcript);
      setTranscriptStatus('complete');
    } catch (error) {
      console.error('Transcript generation failed:', error);
      setTranscriptStatus('error');
    }
  };

  const analyzeVideo = async () => {
    if (!recordedVideoUrl) return;
    setAnalysisStatus('processing');
    try {
      const analysis = await openaiResponses.analyzeVideo(recordedVideoUrl);
      setVideoAnalysis(analysis);
      setAnalysisStatus('complete');
    } catch (error) {
      console.error('Video analysis failed:', error);
      setAnalysisStatus('error');
    }
  };

  const generateMetadata = async () => {
    if (!recordedVideoUrl) return;
    setMetadataStatus('processing');
    try {
      const metadata = await openaiResponses.generateMetadata(recordedVideoUrl);
      setVideoMetadata(metadata);
      setMetadataStatus('complete');
    } catch (error) {
      console.error('Metadata generation failed:', error);
      setMetadataStatus('error');
    }
  };

  const getStatusIcon = (status: ProcessingStatus) => {
    switch (status) {
      case 'processing':
        return <Loader2 className="w-4 h-4 animate-spin" />;
      case 'complete':
        return <div className="w-2 h-2 bg-green-500 rounded-full" />;
      case 'error':
        return <div className="w-2 h-2 bg-red-500 rounded-full" />;
      default:
        return <div className="w-2 h-2 bg-gray-300 rounded-full" />;
    }
  };

  const uploadToSupabase = async (blob: Blob): Promise<string> => {
    try {
      const fileName = `video_${Date.now()}.webm`;
      return await uploadVideo(blob, fileName);
    } catch (error) {
      console.error('Upload failed, falling back to local URL:', error);
      return URL.createObjectURL(blob);
    }
  };

  useEffect(() => {
    if (recordedChunks.length > 0) {
      const blob = new Blob(recordedChunks, { type: 'video/webm' });
      uploadToSupabase(blob).then(setRecordedVideoUrl).catch((error) => {
        console.error('Error processing video:', error);
        setRecordedVideoUrl(URL.createObjectURL(blob));
      });
      setRecordedChunks([]);
    }
  }, [recordedChunks, setRecordedVideoUrl]);

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

      {recordedVideoUrl && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">AI Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={generateThumbnail}
              disabled={thumbnailStatus === 'processing'}
              className="flex flex-col items-center space-y-2 p-4 border rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              <div className="flex items-center space-x-2">
                <ImageIcon className="w-5 h-5" />
                {getStatusIcon(thumbnailStatus)}
              </div>
              <span className="text-sm font-medium">Generate Thumbnail</span>
            </button>

            <button
              onClick={generateTranscript}
              disabled={transcriptStatus === 'processing'}
              className="flex flex-col items-center space-y-2 p-4 border rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5" />
                {getStatusIcon(transcriptStatus)}
              </div>
              <span className="text-sm font-medium">Generate Transcript</span>
            </button>

            <button
              onClick={analyzeVideo}
              disabled={analysisStatus === 'processing'}
              className="flex flex-col items-center space-y-2 p-4 border rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5" />
                {getStatusIcon(analysisStatus)}
              </div>
              <span className="text-sm font-medium">Analyze Video</span>
            </button>

            <button
              onClick={generateMetadata}
              disabled={metadataStatus === 'processing'}
              className="flex flex-col items-center space-y-2 p-4 border rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              <div className="flex items-center space-x-2">
                <Tag className="w-5 h-5" />
                {getStatusIcon(metadataStatus)}
              </div>
              <span className="text-sm font-medium">Generate Metadata</span>
            </button>
          </div>

          {videoThumbnail && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Thumbnail Preview</h4>
              <img src={videoThumbnail} alt="Generated thumbnail" className="max-w-full h-auto rounded-lg" />
            </div>
          )}

          {videoTranscript && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Transcript</h4>
              <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{videoTranscript}</p>
            </div>
          )}

          {videoAnalysis && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Video Analysis</h4>
              <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{videoAnalysis.summary}</p>
            </div>
          )}

          {videoMetadata && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Generated Metadata</h4>
              <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg space-y-1">
                {videoMetadata.title && <p><strong>Title:</strong> {videoMetadata.title}</p>}
                {videoMetadata.description && <p><strong>Description:</strong> {videoMetadata.description}</p>}
                {videoMetadata.tags && videoMetadata.tags.length > 0 && (
                  <p><strong>Tags:</strong> {videoMetadata.tags.join(', ')}</p>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};