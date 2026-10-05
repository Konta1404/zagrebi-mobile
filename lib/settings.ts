import { Settings } from './types';
export const DEFAULT_SETTINGS: Settings = { soundMuted: false, soundVolume: 1, theme: 'light' };
export function parseSettings(value: unknown): Settings {
  const input = typeof value === 'object' && value !== null ? value as Record<string, unknown> : {};
  return {
    soundMuted: typeof input.soundMuted === 'boolean' ? input.soundMuted : false,
    soundVolume: typeof input.soundVolume === 'number' && Number.isFinite(input.soundVolume) ? Math.max(0, Math.min(1, input.soundVolume)) : 1,
    theme: input.theme === 'dark' ? 'dark' : 'light',
  };
}
