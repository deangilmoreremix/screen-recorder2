import { create } from 'zustand';

interface EditorState {
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
}

export const useEditorStore = create<EditorState>((set) => ({
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
    }))
}));