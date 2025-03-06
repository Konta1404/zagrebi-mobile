import { SettingsContext } from "@/lib/context";
import { Settings } from "@/lib/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Appearance } from "react-native";

const DEFAULT_SETTINGS = {
  soundMuted: false,
  soundVolume: 1,
  theme: "light",
} satisfies Settings;

export default function SettingsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);

  const handleLoadSettings = async () => {
    try {
      const storedSettings = await AsyncStorage.getItem("settings");

      if (storedSettings) {
        const storedSettingsParsed = JSON.parse(storedSettings);
        setSettings({
          soundMuted: storedSettingsParsed.soundMuted ?? false,
          soundVolume: storedSettingsParsed.soundVolume ?? 1,
          theme: storedSettingsParsed.theme ?? "light",
        });
        Appearance.setColorScheme(storedSettingsParsed.theme ?? "light");
      }
    } catch {}
  };

  const handleSettingsChange = async () => {
    try {
      Appearance.setColorScheme(settings?.theme ?? "light");

      await AsyncStorage.setItem("settings", JSON.stringify(settings));
    } catch {}
  };

  useEffect(() => {
    handleLoadSettings();
  }, []);

  useEffect(() => {
    handleSettingsChange();
  }, [settings]);

  return (
    <SettingsContext.Provider value={{ settings, setSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}
