import React, { useState } from 'react';
import { useApiKeysStore } from '../../store/apiKeys';
import { Settings, Key, Trash2, Check, Plus, X } from 'lucide-react';

export const ApiKeySettings: React.FC = () => {
  const keys = useApiKeysStore((s) => s.keys);
  const setSupabaseKey = useApiKeysStore((s) => s.setSupabaseKey);
  const setKey = useApiKeysStore((s) => s.setKey);
  const setCustomKey = useApiKeysStore((s) => s.setCustomKey);
  const removeCustomKey = useApiKeysStore((s) => s.removeCustomKey);
  const resetKeys = useApiKeysStore((s) => s.resetKeys);
  const hasKeys = useApiKeysStore((s) => s.hasKeys());

  const [showSettings, setShowSettings] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customValue, setCustomValue] = useState('');

  const handleAddCustom = () => {
    if (customName && customValue) {
      setCustomKey(customName, customValue);
      setCustomName('');
      setCustomValue('');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">API Keys</h3>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <Settings className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      <div className="flex items-center space-x-2 mb-4">
        <div className={`w-2 h-2 rounded-full ${hasKeys ? 'bg-green-500' : 'bg-yellow-500'}`} />
        <span className="text-sm text-gray-600">
          {hasKeys ? 'API keys configured' : 'No API keys configured'}
        </span>
      </div>

      {showSettings && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Supabase Anon Key
            </label>
            <div className="relative">
              <Key className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="password"
                value={keys.supabase.anonKey}
                onChange={(e) => setSupabaseKey('anonKey', e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              OpenAI API Key
            </label>
            <div className="relative">
              <Key className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="password"
                value={keys.openai}
                onChange={(e) => setKey('openai', e.target.value)}
                placeholder="sk-..."
                className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Anthropic API Key
            </label>
            <div className="relative">
              <Key className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="password"
                value={keys.anthropic}
                onChange={(e) => setKey('anthropic', e.target.value)}
                placeholder="sk-ant-..."
                className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Custom API Keys
            </label>
            <div className="space-y-2 mb-2">
              {Object.entries(keys.custom).map(([name, value]) => (
                value && (
                  <div key={name} className="flex items-center space-x-2 bg-gray-50 p-2 rounded-lg">
                    <span className="text-sm font-medium text-gray-700 flex-1">{name}</span>
                    <code className="text-xs text-gray-500 truncate max-w-[120px]">
                      {value.slice(0, 8)}...
                    </code>
                    <button
                      onClick={() => removeCustomKey(name)}
                      className="p-1 hover:bg-gray-200 rounded"
                    >
                      <X className="w-3 h-3 text-gray-500" />
                    </button>
                  </div>
                )
              ))}
            </div>
            <div className="flex space-x-2">
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="Name"
                className="flex-1 px-3 py-2 rounded-lg border border-gray-300 shadow-sm text-sm"
              />
              <input
                type="password"
                value={customValue}
                onChange={(e) => setCustomValue(e.target.value)}
                placeholder="Value"
                className="flex-1 px-3 py-2 rounded-lg border border-gray-300 shadow-sm text-sm"
              />
              <button
                onClick={handleAddCustom}
                disabled={!customName || !customValue}
                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex space-x-2 pt-2">
            <button
              onClick={resetKeys}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              <Trash2 className="w-4 h-4" />
              <span>Reset All</span>
            </button>
            <button
              onClick={() => setShowSettings(false)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Check className="w-4 h-4" />
              <span>Done</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
