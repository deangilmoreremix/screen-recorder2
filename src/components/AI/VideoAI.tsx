import React, { useState } from 'react';
import { Camera, Wand2, Sliders } from 'lucide-react';

export const VideoAI: React.FC = () => {
  const [settings, setSettings] = useState({
    faceDetection: true,
    expressionDetection: true,
    beautification: true,
    backgroundBlur: false
  });

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <h3 className="text-lg font-semibold mb-4">AI Features</h3>
      
      <div className="space-y-4">
        {Object.entries(settings).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
            </span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={value}
                onChange={() => setSettings(prev => ({
                  ...prev,
                  [key]: !prev[key]
                }))}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 
                peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full 
                peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] 
                after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full 
                after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"
              />
            </label>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Active Features</h4>
        <div className="space-y-2">
          {Object.entries(settings).map(([key, value]) => (
            value && (
              <div key={key} className="flex items-center text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </div>
            )
          ))}
        </div>
      </div>
    </div>
  );
};