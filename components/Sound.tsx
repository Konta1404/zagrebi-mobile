import { SettingsContent, SettingsContext } from "@/lib/context";
import { Audio } from "expo-av";
import { useContext, useEffect, useState } from "react";

export default function Sound() {
  const { settings } = useContext<SettingsContent>(SettingsContext);

  const [sound, setSound] = useState<Audio.Sound>();

  const playSound = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require("@/assets/sounds/background_music.mp3")
      );

      await sound.setIsLoopingAsync(true);
      await sound.setIsMutedAsync(true);
      await sound.setVolumeAsync(1);

      setSound(sound);
      await sound.playAsync();
    } catch {}
  };

  const handleSettingsChange = async () => {
    try {
      await sound?.setIsMutedAsync(settings?.soundMuted ?? false);
      await sound?.setVolumeAsync(settings?.soundVolume ?? 1);
    } catch {}
  };

  useEffect(() => {
    playSound();
  }, []);

  useEffect(() => {
    handleSettingsChange();
  }, [settings, sound]);

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  return null;
}
