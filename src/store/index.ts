import { create } from 'zustand';
import { VideoAnalysisResult } from '../lib/openai';

interface EditorState {
  recordedVideoUrl: string | null;
  videoThumbnail: string | null;
  videoTranscript: string | null;
  videoAnalysis: VideoAnalysisResult | null;
  videoMetadata: {
    title?: string;
    description?: string;
    tags?: string[];
  } | null;
  thumbnailsGenerating: boolean;
  videoEffects: {
    brightness: number;
    contrast: number;
    saturation: number;
    blur: number;
    sharpness: number;
    temperature: number;
    vignette: number;
    grain: number;
  };
  aiSettings: {
    faceDetection: boolean;
    beautification: boolean;
    backgroundBlur: boolean;
    expressionDetection: boolean;
  };
  audioSettings: {
    volume: number;
    gain: number;
    noiseReduction: boolean;
    equalizer: number[];
  };
  updateVideoEffects: (effects: Partial<EditorState['videoEffects']>) => void;
  updateAISettings: (settings: Partial<EditorState['aiSettings']>) => void;
  updateAudioSettings: (settings: Partial<EditorState['audioSettings']>) => void;
  setRecordedVideoUrl: (url: string | null) => void;
  setVideoThumbnail: (url: string | null) => void;
  setVideoTranscript: (transcript: string | null) => void;
  setVideoAnalysis: (analysis: VideoAnalysisResult | null) => void;
  setVideoMetadata: (metadata: EditorState['videoMetadata']) => void;
  setThumbnailsGenerating: (generating: boolean) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  recordedVideoUrl: null,
  videoThumbnail: null,
  videoTranscript: null,
  videoAnalysis: null,
  videoMetadata: null,
  thumbnailsGenerating: false,
  videoEffects: {
    brightness: 1,
    contrast: 1,
    saturation: 1,
    blur: 0,
    sharpness: 1,
    temperature: 1,
    vignette: 0,
    grain: 0
  },
  aiSettings: {
    faceDetection: false,
    beautification: false,
    backgroundBlur: false,
    expressionDetection: false
  },
  audioSettings: {
    volume: 1,
    gain: 0,
    noiseReduction: false,
    equalizer: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  },
  updateVideoEffects: (effects) => 
    set((state) => ({
      videoEffects: { ...state.videoEffects, ...effects }
    })),
  updateAISettings: (settings) =>
    set((state) => ({
      aiSettings: { ...state.aiSettings, ...settings }
    })),
  updateAudioSettings: (settings) =>
    set((state) => ({
      audioSettings: { ...state.audioSettings, ...settings }
    })),
  setRecordedVideoUrl: (url) => set({ recordedVideoUrl: url }),
  setVideoThumbnail: (url) => set({ videoThumbnail: url }),
  setVideoTranscript: (transcript) => set({ videoTranscript: transcript }),
  setVideoAnalysis: (analysis) => set({ videoAnalysis: analysis }),
  setVideoMetadata: (metadata) => set({ videoMetadata: metadata }),
  setThumbnailsGenerating: (generating) => set({ thumbnailsGenerating: generating })
}));