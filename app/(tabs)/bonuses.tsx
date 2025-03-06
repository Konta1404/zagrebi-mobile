import {
  Image,
  SafeAreaView,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native";

import { ThemedView } from "@/components/ThemedView";
import PartnersSlider from "@/components/PartnersSlider";
import { useContext, useEffect, useState } from "react";
import {
  ClientContent,
  ClientContext,
  SettingsContent,
  SettingsContext,
} from "@/lib/context";
import Coins from "@/components/Coins";
import { ThemedText } from "@/components/ThemedText";
import AppButton from "@/components/Button";
import { Colors } from "@/constants/Colors";
import AdditionalAds from "@/components/AdditionalAds";
import AdModalContainer from "@/components/AdModalContainer";
import { convertTokens } from "@/lib/apiUtil";
import { Audio } from "expo-av";

export default function Bonuses() {
  const [adModalOpen, setAdModalOpen] = useState(false);
  const [tokensSound, setTokensSound] = useState<Audio.Sound>();

  const { client, setClient } = useContext<ClientContent>(ClientContext);
  const { settings } = useContext<SettingsContent>(SettingsContext);

  const colorScheme = useColorScheme();

  const handleConvertTokens = async () => {
    if (client.tokens < 5) {
      return;
    }

    if (client.scratches === 0) return;

    const data = await convertTokens();

    if (data.status === "success") {
      await tokensSound?.replayAsync();
      setClient(data.data);
    }
  };

  const loadSound = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require("@/assets/sounds/tokens_conversion.mp3")
      );

      await sound.setIsMutedAsync(false);
      await sound.setVolumeAsync(1);

      setTokensSound(sound);
    } catch {}
  };

  const handleSettingsChange = async () => {
    try {
      await tokensSound?.setIsMutedAsync(settings?.soundMuted ?? false);
      await tokensSound?.setVolumeAsync(settings?.soundVolume ?? 1);
    } catch {}
  };

  useEffect(() => {
    loadSound();
  }, []);

  useEffect(() => {
    handleSettingsChange();
  }, [settings, tokensSound]);

  useEffect(() => {
    return tokensSound
      ? () => {
          tokensSound.unloadAsync();
        }
      : undefined;
  }, [tokensSound]);

  return (
    <>
      <ThemedView style={styles.container}>
        <SafeAreaView>
          <ThemedView style={styles.body}>
            <View style={{ flex: 4 }}>
              <PartnersSlider bodyPadding={10} />
              <ThemedView style={styles.tokensContainer}>
                <ThemedView style={styles.tokensAmountContainer}>
                  <Coins />
                  <ThemedView>
                    <ThemedText style={styles.tokensAmountText}>
                      {client.tokens}
                    </ThemedText>
                    <ThemedText style={styles.tokensText}>
                      Bonus Tokeni
                    </ThemedText>
                  </ThemedView>
                </ThemedView>
                <AppButton
                  variant="outlined"
                  text="Osvoji još"
                  textStyle={{ fontWeight: "bold" }}
                  onPress={() => setAdModalOpen(true)}
                />
              </ThemedView>
              <ThemedView style={styles.convertContainer}>
                <ThemedText style={styles.convertHeading}>
                  Konvertujte Vaše tokene
                </ThemedText>
                <ThemedView
                  style={[
                    {
                      backgroundColor:
                        Colors[colorScheme ?? "light"].secondaryLight,
                    },
                    styles.adSectionContainer,
                  ]}
                >
                  <ThemedView
                    style={[
                      {
                        backgroundColor:
                          Colors[colorScheme ?? "light"].secondary,
                      },
                      styles.adIconContainer,
                    ]}
                  >
                    <Image
                      source={require("@/assets/images/ads.png")}
                      alt="Reklame"
                      style={{ height: 50, width: 50 }}
                    />
                  </ThemedView>
                  <ThemedText
                    style={[
                      { color: Colors[colorScheme ?? "light"].tint },
                      styles.convertDescription,
                    ]}
                  >
                    5 bonus tokena se može konvertovati u novu grebalicu
                  </ThemedText>
                  <View style={styles.convertAmountContainer}>
                    <ThemedText style={styles.convertTokensAmountText}>
                      {client.tokens}/5
                    </ThemedText>
                    <AppButton
                      text="Konvertuj"
                      buttonStyle={{ paddingHorizontal: 10 }}
                      textStyle={{ fontSize: 14 }}
                      onPress={handleConvertTokens}
                    />
                  </View>
                </ThemedView>
              </ThemedView>
            </View>
            <View style={{ flex: 5 }}>
              <AdditionalAds bodyPadding={10} />
            </View>
          </ThemedView>
        </SafeAreaView>
      </ThemedView>
      <AdModalContainer
        open={adModalOpen}
        setOpen={setAdModalOpen}
        screen="bonusi"
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    paddingHorizontal: 10,
    paddingVertical: 30,
    gap: 20,
    height: "100%",
  },
  tokensContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 5,
    marginVertical: 10,
  },
  tokensAmountContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  tokensAmountText: {
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 20,
  },
  tokensText: {
    fontWeight: "bold",
    fontSize: 12,
  },
  convertContainer: {
    gap: 10,
  },
  convertHeading: {
    fontWeight: "bold",
    fontSize: 18,
  },
  adSectionContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 5,
    padding: 10,
    borderRadius: 10,
  },
  adIconContainer: {
    borderRadius: 10,
    padding: 10,
    width: "20%",
    alignItems: "center",
  },
  convertDescription: {
    width: "50%",
    textAlign: "center",
  },
  convertAmountContainer: {
    gap: 10,
    alignItems: "center",
    width: "30%",
  },
  convertTokensAmountText: {
    fontWeight: "bold",
    fontSize: 20,
  },
});
