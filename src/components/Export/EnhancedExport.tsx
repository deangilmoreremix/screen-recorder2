import React, { useState } from 'react';
import { Download, Settings, Film, Clock, HardDrive, Gauge, Cog } from 'lucide-react';
import { useEditorStore } from '../../store';

interface ExportSettings {
  format: 'mp4' | 'webm' | 'gif' | 'png-sequence';
  codec: 'h264' | 'h265' | 'vp8' | 'vp9' | 'prores';
  quality: {
    video: number;
    audio: number;
  };
  resolution: {
    width: number;
    height: number;
  };
  fps: number;
  bitrate: {
    video: number;
    audio: number;
  };
  audioSettings: {
    sampleRate: number;
    channels: number;
    codec: 'aac' | 'mp3' | 'wav';
  };
}

export const EnhancedExport: React.FC = () => {
  const [settings, setSettings] = useState<ExportSettings>({
    format: 'mp4',
    codec: 'h264',
    quality: {
      video: 100,
      audio: 100
    },
    resolution: {
      width: 1920,
      height: 1080
    },
    fps: 30,
    bitrate: {
      video: 8000,
      audio: 192
    },
    audioSettings: {
      sampleRate: 48000,
      channels: 2,
      codec: 'aac'
    }
  });

  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);

  const presets = {
    web: {
      format: 'mp4',
      codec: 'h264',
      quality: { video: 85, audio: 90 },
      resolution: { width: 1280, height: 720 },
      fps: 30,
      bitrate: { video: 4000, audio: 128 }
    },
    professional: {
      format: 'mp4',
      codec: 'h265',
      quality: { video: 100, audio: 100 },
      resolution: { width: 3840, height: 2160 },
      fps: 60,
      bitrate: { video: 16000, audio: 320 }
    },
    mobile: {
      format: 'mp4',
      codec: 'h264',
      quality: { video: 75, audio: 80 },
      resolution: { width: 854, height: 480 },
      fps: 30,
      bitrate: { video: 2000, audio: 96 }
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    setProgress(0);

    try {
      // Export logic will be implemented here
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 500));
        setProgress(i);
      }
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
      setProgress(0);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Export Settings</h3>
        <div className="flex space-x-2">
          {Object.entries(presets).map(([name, preset]) => (
            <button
              key={name}
              onClick={() => setSettings({ ...settings, ...preset })}
              className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg"
            >
              {name.charAt(0).toUpperCase() + name.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Format
            </label>
            <select
              value={settings.format}
              onChange={(e) => setSettings({
                ...settings,
                format: e.target.value as ExportSettings['format']
              })}
              className="w-full rounded-lg border-gray-300 shadow-sm"
            >
              <option value="mp4">MP4</option>
              <option value="webm">WebM</option>
              <option value="gif">GIF</option>
              <option value="png-sequence">PNG Sequence</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Codec
            </label>
            <select
              value={settings.codec}
              onChange={(e) => setSettings({
                ...settings,
                codec: e.target.value as ExportSettings['codec']
              })}
              className="w-full rounded-lg border-gray-300 shadow-sm"
            >
              <option value="h264">H.264</option>
              <option value="h265">H.265 (HEVC)</option>
              <option value="vp8">VP8</option>
              <option value="vp9">VP9</option>
              <option value="prores">ProRes</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Resolution
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                value={settings.resolution.width}
                onChange={(e) => setSettings({
                  ...settings,
                  resolution: {
                    ...settings.resolution,
                    width: parseInt(e.target.value)
                  }
                })}
                className="rounded-lg border-gray-300 shadow-sm"
                placeholder="Width"
              />
              <input
                type="number"
                value={settings.resolution.height}
                onChange={(e) => setSettings({
                  ...settings,
                  resolution: {
                    ...settings.resolution,
                    height: parseInt(e.target.value)
                  }
                })}
                className="rounded-lg border-gray-300 shadow-sm"
                placeholder="Height"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Video Quality
            </label>
            <input
              type="range"
              min="1"
              max="100"
              value={settings.quality.video}
              onChange={(e) => setSettings({
                ...settings,
                quality: {
                  ...settings.quality,
                  video: parseInt(e.target.value)
                }
              })}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span>Lower size</span>
              <span>{settings.quality.video}%</span>
              <span>Better quality</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Audio Settings
            </label>
            <div className="grid grid-cols-2 gap-2">
              <select
                value={settings.audioSettings.codec}
                onChange={(e) => setSettings({
                  ...settings,
                  audioSettings: {
                    ...settings.audioSettings,
                    codec: e.target.value as ExportSettings['audioSettings']['codec']
                  }
                })}
                className="rounded-lg border-gray-300 shadow-sm"
              >
                <option value="aac">AAC</option>
                <option value="mp3">MP3</option>
                <option value="wav">WAV</option>
              </select>
              <select
                value={settings.audioSettings.channels}
                onChange={(e) => setSettings({
                  ...settings,
                  audioSettings: {
                    ...settings.audioSettings,
                    channels: parseInt(e.target.value)
                  }
                })}
                className="rounded-lg border-gray-300 shadow-sm"
              >
                <option value="1">Mono</option>
                <option value="2">Stereo</option>
                <option value="6">5.1 Surround</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Estimated file size: {Math.round(
              (settings.bitrate.video + settings.bitrate.audio) * 
              (settings.resolution.width * settings.resolution.height) / 
              (1920 * 1080) / 8000
            )} MB
          </div>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isExporting ? (
              <>
                <Cog className="w-4 h-4 animate-spin" />
                <span>Exporting... {progress}%</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Export</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};