import { useState } from 'react';

interface AISettings {
  faceDetection: boolean;
  expressionDetection: boolean;
  beautification: boolean;
  backgroundBlur: boolean;
}

export const VideoAI: React.FC = () => {
  const [settings, setSettings] = useState<AISettings>({
    faceDetection: true,
    expressionDetection: true,
    beautification: true,
    backgroundBlur: false
  });

  const toggle = (key: keyof AISettings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const labels: Record<keyof AISettings, string> = {
    faceDetection: 'Face Detection',
    expressionDetection: 'Expression Detection',
    beautification: 'Beautification',
    backgroundBlur: 'Background Blur'
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <h3 className="text-lg font-semibold mb-4">AI Features</h3>

      <div className="space-y-4">
        {(Object.keys(settings) as Array<keyof AISettings>).map((key) => (
          <div key={key} className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">{labels[key]}</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={settings[key]}
                onChange={() => toggle(key)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
            </label>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Active Features</h4>
        <div className="space-y-2">
          {(Object.keys(settings) as Array<keyof AISettings>).map((key) =>
            settings[key] ? (
              <div key={key} className="flex items-center text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                {labels[key]}
              </div>
            ) : null
          )}
        </div>
      </div>
    </div>
  );
};
