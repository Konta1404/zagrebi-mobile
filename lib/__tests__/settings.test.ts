import { DEFAULT_SETTINGS, parseSettings } from '../settings';
it('restores valid saved preferences', () => {
  const saved = { soundMuted: true, soundVolume: 0.4, theme: 'dark' as const };
  expect(parseSettings(saved)).toEqual(saved);
});
it('rejects invalid stored preference types', () => {
  expect(parseSettings({ soundMuted: 'yes', soundVolume: NaN, theme: 'invalid' })).toEqual(DEFAULT_SETTINGS);
});
it('clamps stored volume to the supported range', () => {
  expect(parseSettings({ soundVolume: 5 }).soundVolume).toBe(1);
  expect(parseSettings({ soundVolume: -3 }).soundVolume).toBe(0);
});
