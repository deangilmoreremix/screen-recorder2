import React, { useRef, useEffect } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { Volume2, VolumeX, Music, Mic } from 'lucide-react';

export const AudioEditor: React.FC = () => {
  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurfer = useRef<WaveSurfer | null>(null);
  const [volume, setVolume] = React.useState(1);
  const [isMuted, setIsMuted] = React.useState(false);

  useEffect(() => {
    if (waveformRef.current) {
      wavesurfer.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: '#4f46e5',
        progressColor: '#818cf8',
        cursorColor: '#312e81',
        barWidth: 2,
        barRadius: 3,
        responsive: true,
        height: 60,
      });

      return () => {
        wavesurfer.current?.destroy();
      };
    }
  }, []);

  const toggleMute = () => {
    if (wavesurfer.current) {
      wavesurfer.current.setMuted(!isMuted);
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    wavesurfer.current?.setVolume(newVolume);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Audio Editor</h3>
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleMute}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5 text-gray-600" />
            ) : (
              <Volume2 className="w-5 h-5 text-gray-600" />
            )}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={handleVolumeChange}
            className="w-24"
          />
        </div>
      </div>
      
      <div ref={waveformRef} className="mb-4" />
      
      <div className="flex justify-center space-x-4">
        <button className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
          <Music className="w-4 h-4" />
          <span>Add Music</span>
        </button>
        <button className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
          <Mic className="w-4 h-4" />
          <span>Record Voice</span>
        </button>
      </div>
    </div>
  );
};