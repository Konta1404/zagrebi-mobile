import { Gift, GIFT_TYPE, GiftWinner } from "@/lib/types";
import { BlurView } from "expo-blur";
import {
  Dimensions,
  Image,
  Linking,
  Modal,
  ModalProps,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  Vibration,
  View,
} from "react-native";
import AppButton from "../Button";
import { router } from "expo-router";
import { FRONTEND_URL } from "@/lib/config";
import { useContext, useEffect, useState } from "react";
import {
  ClientContent,
  ClientContext,
  SettingsContent,
  SettingsContext,
} from "@/lib/context";
import { Audio } from "expo-av";
import ConfettiCannon from "react-native-confetti-cannon";

type Props = ModalProps & {
  gift?: Gift;
  giftWinner?: GiftWinner | null;
  open: boolean;
  setOpen: (s: any) => void;
};

const { width, height } = Dimensions.get("window");

export default function GiftModal({ gift, giftWinner, open, setOpen }: Props) {
  const [winSound, setWinSound] = useState<Audio.Sound>();
  const [showConfetti, setShowConfetti] = useState(false);

  const { settings } = useContext<SettingsContent>(SettingsContext);
  const { client } = useContext<ClientContent>(ClientContext);

  const loadSound = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require("@/assets/sounds/win.mp3")
      );

      await sound.setIsMutedAsync(false);
      await sound.setVolumeAsync(1);

      setWinSound(sound);
    } catch {}
  };

  const handleSettingsChange = async () => {
    try {
      await winSound?.setIsMutedAsync(settings?.soundMuted ?? false);
      await winSound?.setVolumeAsync(settings?.soundVolume ?? 1);
    } catch {}
  };

  useEffect(() => {
    loadSound();
  }, []);

  useEffect(() => {
    if (open) {
      setShowConfetti(true);
      Vibration.vibrate(1000);
      winSound?.replayAsync();
    }
  }, [open]);

  useEffect(() => {
    handleSettingsChange();
  }, [settings, winSound]);

  useEffect(() => {
    return winSound
      ? () => {
          winSound.unloadAsync();
        }
      : undefined;
  }, [winSound]);

  return (
    <>
      {gift && (
        <>
          <Modal visible={open} transparent={true} animationType="fade">
            <BlurView intensity={50} style={styles.container}>
              {Platform.OS !== "android" && showConfetti && (
                <View style={styles.confettiContainer}>
                  <ConfettiCannon
                    count={125}
                    origin={{
                      x: Math.floor(width / 2),
                      y: Math.floor(height / 2),
                    }}
                    explosionSpeed={500}
                    fallSpeed={1250}
                    fadeOut={true}
                    autoStartDelay={0}
                    autoStart={true}
                    onAnimationEnd={() => setShowConfetti(false)}
                  />
                </View>
              )}
              <SafeAreaView style={styles.body}>
                <View style={styles.dialog}>
                  <Image
                    source={{
                      uri: gift.image,
                    }}
                    alt={gift.name}
                    style={styles.giftImage}
                    resizeMode="cover"
                  />
                  {gift.type === GIFT_TYPE.GIFT ||
                  gift.type === GIFT_TYPE.VOUCHER ? (
                    <>
                      <Text numberOfLines={4} style={styles.giftHeading}>
                        Čestitamo, osvojili ste {gift.name}!
                      </Text>
                      <Text style={styles.giftSubheading}>
                        Kako bi poklon stigao na Vašu lokaciju, potrebno je da
                        nam ostavite Vaše podatke.
                      </Text>
                      {gift.type === GIFT_TYPE.VOUCHER && (
                        <Text style={styles.giftSubheading}>
                          Molimo vas da odmah odlučite da li želite preuzeti
                          poklon za sebe ili ga proslijediti prijatelju, jer
                          nakon što preuzmete kod sa popunjenim podacima, neće
                          biti moguće da ga proslijedite drugoj osobi.
                        </Text>
                      )}
                      <AppButton
                        text="Preuzmi poklon"
                        textStyle={{ fontWeight: "bold" }}
                        onPress={() => {
                          setOpen(false);
                          Linking.openURL(
                            `${FRONTEND_URL}/dobitak/${giftWinner?._id}?clientId=${client?._id}`
                          );
                        }}
                      />
                      {gift.type === GIFT_TYPE.VOUCHER && (
                        <AppButton
                          variant="secondary"
                          text="Pokloni prijatelju"
                          textStyle={{ fontWeight: "bold" }}
                          onPress={() => {
                            setOpen(false);
                            Linking.openURL(
                              `${FRONTEND_URL}/dobitak/${giftWinner?._id}/pokloni?clientId=${client?._id}`
                            );
                          }}
                        />
                      )}
                      <AppButton
                        text="Zatvori"
                        variant="ghost"
                        onPress={() => {
                          setOpen(false);
                        }}
                      />
                    </>
                  ) : (
                    <>
                      <Text numberOfLines={4} style={styles.giftHeading}>
                        Čestitamo, osvojili ste {gift.tokenAmount} bonus tokena!
                      </Text>
                      <Text style={styles.giftSubheading}>
                        Pretvorite Vaše bonuse u novu priliku da osvojite jedan
                        od vrijednih poklona!
                      </Text>
                      <AppButton
                        text="Konvertuj bonuse"
                        textStyle={{ fontWeight: "bold" }}
                        onPress={() => {
                          setOpen(false);
                          router.replace("/bonuses");
                        }}
                      />
                      <AppButton
                        variant={"ghost"}
                        text="Izađi"
                        textStyle={{ fontWeight: "bold" }}
                        onPress={() => {
                          setOpen(false);
                        }}
                      />
                    </>
                  )}
                </View>
              </SafeAreaView>
            </BlurView>
          </Modal>
        </>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    height: "100%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },

  confettiContainer: {
    position: "absolute",
    left: 0,
    top: 0,
    height: "100%",
    width: "100%",
    zIndex: 50,
  },

  body: {
    width: "100%",
    alignItems: "center",
  },

  dialog: {
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 10,
    padding: 10,
    width: "90%",
    backgroundColor: "#fff",
    gap: 12,
  },

  giftImage: {
    height: 200,
    width: "100%",
    borderRadius: 10,
  },

  giftHeading: {
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
  },

  giftSubheading: {
    fontSize: 14,
    color: "gray",
    textAlign: "center",
  },
});
