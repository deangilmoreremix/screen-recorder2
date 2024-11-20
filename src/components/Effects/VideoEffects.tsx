import React, { useState } from 'react';
import { useEditorStore } from '../../store';
import {
  Wand2, Droplets, Sun, Contrast, Palette, Sparkles, CloudFog, Wind,
  Sliders, Layers, Gauge, Fingerprint
} from 'lucide-react';

export const VideoEffects: React.FC = () => {
  const { videoEffects, updateVideoEffects } = useEditorStore();
  const [activeEffect, setActiveEffect] = useState<string | null>(null);

  const effects = [
    { name: 'Magic Enhance', icon: Wand2, color: 'blue', param: 'enhance' },
    { name: 'Color Grade', icon: Palette, color: 'purple', param: 'colorGrade' },
    { name: 'Blur', icon: CloudFog, color: 'indigo', param: 'blur' },
    { name: 'Motion', icon: Wind, color: 'green', param: 'motion' },
    { name: 'Brightness', icon: Sun, color: 'yellow', param: 'brightness' },
    { name: 'Contrast', icon: Contrast, color: 'orange', param: 'contrast' },
    { name: 'Saturation', icon: Droplets, color: 'red', param: 'saturation' },
    { name: 'Sharpness', icon: Fingerprint, color: 'pink', param: 'sharpness' }
  ];

  const adjustments = [
    { name: 'Brightness', min: 0, max: 2, step: 0.1, value: videoEffects.brightness },
    { name: 'Contrast', min: 0, max: 2, step: 0.1, value: videoEffects.contrast },
    { name: 'Saturation', min: 0, max: 2, step: 0.1, value: videoEffects.saturation },
    { name: 'Blur', min: 0, max: 20, step: 1, value: videoEffects.blur }
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <h3 className="text-lg font-semibold mb-4">Video Effects</h3>
      
      <div className="grid grid-cols-4 gap-3 mb-6">
        {effects.map((effect) => {
          const Icon = effect.icon;
          return (
            <button
              key={effect.name}
              className={`flex flex-col items-center p-3 rounded-lg transition-colors
                border ${activeEffect === effect.param 
                  ? `border-${effect.color}-500 bg-${effect.color}-50` 
                  : 'border-gray-200 hover:bg-gray-50'}`}
              onClick={() => setActiveEffect(
                activeEffect === effect.param ? null : effect.param
              )}
            >
              <Icon className={`w-6 h-6 text-${effect.color}-500 mb-2`} />
              <span className="text-sm text-gray-700">{effect.name}</span>
            </button>
          );
        })}
      </div>

      {activeEffect && (
        <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
          {adjustments.map((adj) => (
            <div key={adj.name} className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-700">{adj.name}</span>
                <span className="text-sm text-gray-500">
                  {Math.round(adj.value * 100)}%
                </span>
              </div>
              <input
                type="range"
                min={adj.min}
                max={adj.max}
                step={adj.step}
                value={adj.value}
                onChange={(e) => updateVideoEffects({
                  [adj.name.toLowerCase()]: parseFloat(e.target.value)
                })}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          ))}
          
          <div className="flex justify-end space-x-2 mt-4">
            <button
              onClick={() => updateVideoEffects({
                brightness: 1,
                contrast: 1,
                saturation: 1,
                blur: 0
              })}
              className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800"
            >
              Reset
            </button>
            <button
              onClick={() => setActiveEffect(null)}
              className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
};