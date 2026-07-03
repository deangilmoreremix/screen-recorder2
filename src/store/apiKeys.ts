import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserApiKeys } from '../types/api';

interface ApiKeysState {
  keys: UserApiKeys;
  setKeys: (keys: Partial<UserApiKeys>) => void;
  setKey: <K extends keyof UserApiKeys>(name: K, value: UserApiKeys[K]) => void;
  setSupabaseKey: (field: 'anonKey' | 'serviceRoleKey', value: string) => void;
  setCustomKey: (name: string, value: string) => void;
  removeCustomKey: (name: string) => void;
  resetKeys: () => void;
  hasKeys: () => boolean;
}

const initialState: UserApiKeys = {
  supabase: { anonKey: '', serviceRoleKey: '' },
  openai: '',
  anthropic: '',
  custom: {}
};

export const useApiKeysStore = create<ApiKeysState>()(
  persist(
    (set, get) => ({
      keys: initialState,

      setKeys: (partial: Partial<UserApiKeys>) => set((state) => ({
        keys: { ...state.keys, ...partial }
      })),

      setKey: <K extends keyof UserApiKeys>(name: K, value: UserApiKeys[K]) => set((state) => ({
        keys: { ...state.keys, [name]: value }
      })),

      setSupabaseKey: (field, value) => set((state) => ({
        keys: {
          ...state.keys,
          supabase: { ...state.keys.supabase, [field]: value }
        }
      })),

      setCustomKey: (name, value) => set((state) => {
        const custom = { ...(state.keys.custom || {}) };
        if (value) {
          custom[name] = value;
        } else {
          delete custom[name];
        }
        return { keys: { ...state.keys, custom } };
      }),

      removeCustomKey: (name) => set((state) => {
        const custom = { ...(state.keys.custom || {}) };
        delete custom[name];
        return { keys: { ...state.keys, custom } };
      }),

      resetKeys: () => set({ keys: initialState }),

      hasKeys: () => {
        const { keys } = get();
        return !!(
          keys.supabase?.anonKey ||
          keys.supabase?.serviceRoleKey ||
          keys.openai ||
          keys.anthropic ||
          (keys.custom && Object.values(keys.custom).some(v => !!v))
        );
      }
    }),
    { name: 'video-editor-api-keys' }
  )
);
