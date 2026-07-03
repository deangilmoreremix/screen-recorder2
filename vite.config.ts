import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-media': [
            '@ffmpeg/ffmpeg',
            '@ffmpeg/util',
            '@mediapipe/face_detection',
            '@mediapipe/face_mesh',
            '@tensorflow/tfjs',
            '@tensorflow-models/face-landmarks-detection',
            '@tensorflow-models/body-segmentation',
          ],
          'vendor-ui': ['lucide-react', 'wavesurfer.js'],
          'vendor-state': ['zustand', 'comlink'],
        },
      },
    },
  },
});
