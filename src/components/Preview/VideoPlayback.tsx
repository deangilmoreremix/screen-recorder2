import React from 'react';
import { Play, Pause, SkipBack, SkipForward, Download } from 'lucide-react';
import { useEditorStore } from '../../store';

export const VideoPlayback: React.FC = () => {
  const { currentProject } = useEditorStore();
  const [isPlaying, setIsPlaying] = React.useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  const togglePlayback = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleDownload = () => {
    if (videoRef.current?.src) {
      const a = document.createElement('a');
      a.href = videoRef.current.src;
      a.download = `recording-${Date.now()}.webm`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="aspect-video bg-gray-900 relative">
        {currentProject?.timeline.clips[0]?.url ? (
          <video
            ref={videoRef}
            src={currentProject.timeline.clips[0].url}
            className="w-full h-full object-contain"
            onEnded={() => setIsPlaying(false)}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            No recording selected
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            <button
              onClick={() => {
                if (videoRef.current) {
                  videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 5);
                }
              }}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <SkipBack className="w-5 h-5" />
            </button>
            <button
              onClick={togglePlayback}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5" />
              )}
            </button>
            <button
              onClick={() => {
                if (videoRef.current) {
                  videoRef.current.currentTime = Math.min(
                    videoRef.current.duration,
                    videoRef.current.currentTime + 5
                  );
                }
              }}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <SkipForward className="w-5 h-5" />
            </button>
          </div>
          
          <button
            onClick={handleDownload}
            className="flex items-center space-x-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Download className="w-4 h-4" />
            <span className="text-sm">Download</span>
          </button>
        </div>
      </div>
    </div>
  );
};