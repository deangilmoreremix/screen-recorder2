import React from 'react';
import { VideoRecorder } from './components/Recorder/VideoRecorder';
import { VideoPlayback } from './components/Preview/VideoPlayback';
import { AdvancedVideoEffects } from './components/Effects/AdvancedVideoEffects';
import { TransitionEffects } from './components/Transitions/TransitionEffects';
import { AudioEditor } from './components/Audio/AudioEditor';
import { VideoAI } from './components/AI/VideoAI';
import { EnhancedExport } from './components/Export/EnhancedExport';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Advanced Video Editor</h1>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Left Side */}
          <div className="lg:col-span-2 space-y-6">
            <VideoRecorder />
            <AudioEditor />
            <TransitionEffects />
          </div>
          
          {/* Sidebar - Right Side */}
          <div className="space-y-6">
            <VideoPlayback />
            <VideoAI />
            <AdvancedVideoEffects />
            <EnhancedExport />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;