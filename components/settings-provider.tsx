import { SettingsContext } from '@/lib/context';
import { DEFAULT_SETTINGS, parseSettings } from '@/lib/settings';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { Appearance } from 'react-native';

export default function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const saved = await AsyncStorage.getItem('settings');
        if (active && saved) setSettings(parseSettings(JSON.parse(saved)));
      } catch { /* Keep defaults if local storage is corrupt/unavailable. */ }
      finally { if (active) setHydrated(true); }
    })();
    return () => { active = false; };
  }, []);
  useEffect(() => {
    if (!hydrated) return;
    Appearance.setColorScheme(settings.theme);
    AsyncStorage.setItem('settings', JSON.stringify(settings)).catch(() => {});
  }, [settings, hydrated]);
  return <SettingsContext.Provider value={{ settings, setSettings }}>{children}</SettingsContext.Provider>;
}
