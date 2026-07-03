import { useState, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, Download } from 'lucide-react';
import { useEditorStore } from '../../store';

export const VideoPlayback: React.FC = () => {
  const currentProject = useEditorStore((s) => s.currentProject);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlayback = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(() => {
          /* autoplay can be blocked; ignore */
        });
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

  const clipUrl = currentProject?.timeline.clips[0]?.url;

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="aspect-video bg-gray-900 relative">
        {clipUrl ? (
          <video
            ref={videoRef}
            src={clipUrl}
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
              aria-label="Skip back 5 seconds"
            >
              <SkipBack className="w-5 h-5" />
            </button>
            <button
              onClick={togglePlayback}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </button>
            <button
              onClick={() => {
                if (videoRef.current) {
                  videoRef.current.currentTime = Math.min(
                    videoRef.current.duration || 0,
                    videoRef.current.currentTime + 5
                  );
                }
              }}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Skip forward 5 seconds"
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