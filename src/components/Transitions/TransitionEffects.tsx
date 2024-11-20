import React, { useState } from 'react';
import { useEditorStore } from '../../store';
import { 
  ArrowLeftRight, ArrowUpDown, Combine, 
  Divide, Layers, RotateCcw, Shuffle, Move 
} from 'lucide-react';

export const TransitionEffects: React.FC = () => {
  const [selectedTransition, setSelectedTransition] = useState<string | null>(null);
  const [duration, setDuration] = useState(1);

  const transitions = [
    { name: 'Dissolve', type: 'dissolve', icon: Layers },
    { name: 'Slide Left', type: 'slide-left', icon: ArrowLeftRight },
    { name: 'Slide Right', type: 'slide-right', icon: ArrowLeftRight },
    { name: 'Slide Up', type: 'slide-up', icon: ArrowUpDown },
    { name: 'Slide Down', type: 'slide-down', icon: ArrowUpDown },
    { name: 'Fade', type: 'fade', icon: Move },
    { name: 'Wipe', type: 'wipe', icon: Divide },
    { name: 'Cross Zoom', type: 'cross-zoom', icon: Combine },
    { name: 'Rotate', type: 'rotate', icon: RotateCcw },
    { name: 'Random', type: 'random', icon: Shuffle }
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <h3 className="text-lg font-semibold mb-4">Transition Effects</h3>
      
      <div className="grid grid-cols-5 gap-3 mb-4">
        {transitions.map((transition) => {
          const Icon = transition.icon;
          return (
            <button
              key={transition.type}
              onClick={() => setSelectedTransition(
                selectedTransition === transition.type ? null : transition.type
              )}
              className={`flex flex-col items-center p-3 rounded-lg transition-colors
                ${selectedTransition === transition.type 
                  ? 'bg-blue-50 border-blue-500 border-2' 
                  : 'border border-gray-200 hover:bg-gray-50'}`}
            >
              <Icon className={`w-6 h-6 mb-2 ${
                selectedTransition === transition.type 
                  ? 'text-blue-500' 
                  : 'text-gray-600'
              }`} />
              <span className="text-xs text-center">{transition.name}</span>
            </button>
          );
        })}
      </div>

      {selectedTransition && (
        <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-700">Duration</span>
              <span className="text-sm text-gray-500">{duration}s</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="3"
              step="0.1"
              value={duration}
              onChange={(e) => setDuration(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => {
                setSelectedTransition(null);
                setDuration(1);
              }}
              className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800"
            >
              Reset
            </button>
            <button
              onClick={() => {
                // Apply transition logic here
                setSelectedTransition(null);
              }}
              className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
            >
              Apply Transition
            </button>
          </div>
        </div>
      )}
    </div>
  );
};