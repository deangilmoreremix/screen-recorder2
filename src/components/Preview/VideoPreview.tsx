import { useState, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import { useEditorStore } from '../../store';

export const VideoPreview: React.FC = () => {
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

  const clipUrl = currentProject?.timeline.clips[0]?.url;

  return (
    <div className="bg-gray-900 rounded-lg overflow-hidden">
      <div className="aspect-video bg-black relative">
        {clipUrl ? (
          <video
            ref={videoRef}
            src={clipUrl}
            className="w-full h-full object-contain"
            onEnded={() => setIsPlaying(false)}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            No video selected
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => {
              if (videoRef.current) {
                videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 5);
              }
            }}
            className="p-2 text-white hover:text-blue-400 transition-colors"
            aria-label="Skip back 5 seconds"
          >
            <SkipBack className="w-6 h-6" />
          </button>
          <button
            onClick={togglePlayback}
            className="p-2 text-white hover:text-blue-400 transition-colors"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
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
            className="p-2 text-white hover:text-blue-400 transition-colors"
            aria-label="Skip forward 5 seconds"
          >
            <SkipForward className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};