import { ImageAd, Settings, VideoAd } from "@/lib/types";
import {
  DimensionValue,
  Image,
  Linking,
  Modal,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { ThemedView } from "../ThemedView";
import { useContext, useEffect, useRef, useState } from "react";
import { AVPlaybackStatus, ResizeMode, Video } from "expo-av";
import AnimatedRing from "../AnimatedRing";
import AppButton from "../Button";
import { ThemedText } from "../ThemedText";
import { Colors } from "@/constants/Colors";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { BlurView } from "expo-blur";
import { SettingsContent, SettingsContext } from "@/lib/context";
import { updateAdAnalytics } from "@/lib/apiUtil";

type ModalAd = (ImageAd | VideoAd) & {
  isFallback: boolean;
};

type Props = {
  ad: ModalAd;
  open: boolean;
  setOpen: (s: any) => void;
};

const CLOSE_BUTTON_SIZE = 50;
const IMAGE_AD_DURATION = 10;

export default function AdModal({ ad, open, setOpen }: Props) {
  const [seconds, setSeconds] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [ctaModalOpen, setCtaModalOpen] = useState(false);
  const [prevSoundMuted, setPrevSoundMuted] = useState(false);

  const videoRef = useRef<Video | null>(null);

  const colorScheme = useColorScheme();

  const width = useSharedValue(0);
  const buttonsModalTransform = useSharedValue(0);

  const { settings, setSettings } =
    useContext<SettingsContent>(SettingsContext);

  const progressBarStyle = useAnimatedStyle(() => {
    return {
      width: `${Math.min(Math.floor(width.value), 100)}%` as DimensionValue,
    };
  });

  const buttonsModalStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: buttonsModalTransform.value }],
    };
  });

  const handleVideoMount = async () => {
    if (videoRef.current) {
      await videoRef.current.playAsync();
    }
  };

  const handlePlaybackStatusUpdate = async (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      setVideoDuration(
        status.playableDurationMillis ?? IMAGE_AD_DURATION * 1000
      );
      if (status.didJustFinish) {
        setCtaModalOpen(true);
      }
    }
  };

  const handleClose = () => {
    setSettings((prev: Settings) => ({ ...prev, soundMuted: prevSoundMuted }));
    setOpen(false);
    setCtaModalOpen(false);
  };

  const handleAdClick = async () => {
    await updateAdAnalytics(ad._id, undefined, 1);
    Linking.openURL(ad.link ?? "https://zagrebi.me");
  };

  useEffect(() => {
    if ((ad as VideoAd).video && videoDuration)
      width.value = withTiming(100, {
        duration: videoDuration,
        easing: Easing.linear,
      });
    if ((ad as ImageAd).image) {
      width.value = withTiming(100, {
        duration: IMAGE_AD_DURATION * 1000,
        easing: Easing.linear,
      });
    }
  }, [videoDuration]);

  useEffect(() => {
    setPrevSoundMuted(settings?.soundMuted ?? false);
    setSettings((prev: Settings) => ({ ...prev, soundMuted: true }));
    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if ((ad as ImageAd).image && seconds >= IMAGE_AD_DURATION) {
      setCtaModalOpen(true);
    }
  }, [seconds]);

  useEffect(() => {
    if (ctaModalOpen) {
      buttonsModalTransform.value = withTiming(-200, {
        duration: 300,
        easing: Easing.linear,
      });
    }
  }, [ctaModalOpen]);

  return (
    <>
      <Modal visible={open} transparent={true} animationType="none">
        <ThemedView style={styles.container}>
          <ThemedView style={styles.body}>
            <Animated.View
              style={[
                styles.progressBar,
                { backgroundColor: Colors[colorScheme ?? "light"].tint },
                progressBarStyle,
              ]}
            />
            <ThemedView style={styles.closeAdContainer}>
              {seconds >= IMAGE_AD_DURATION || ad.isFallback ? (
                <AppButton
                  variant="ghost"
                  text="X"
                  onPress={handleClose}
                  textStyle={{ fontSize: 24 }}
                />
              ) : (
                <>
                  <AnimatedRing
                    size={CLOSE_BUTTON_SIZE}
                    duration={IMAGE_AD_DURATION * 1000}
                  />
                  <View style={styles.closeAdButtonText}>
                    <ThemedText style={{ fontSize: 14 }}>
                      {IMAGE_AD_DURATION - seconds}
                    </ThemedText>
                  </View>
                </>
              )}
            </ThemedView>
            <TouchableOpacity
              onPress={handleAdClick}
              style={styles.adCointainer}
            >
              {ad.isFallback ? (
                <Image
                  source={require("@/assets/images/zagrebi-fallback.jpg")}
                  alt={ad.name}
                  style={styles.imageAd}
                  resizeMode="cover"
                />
              ) : !!(ad as ImageAd).image ? (
                <Image
                  source={{
                    uri: (ad as ImageAd).image,
                  }}
                  alt={ad.name}
                  style={styles.imageAd}
                  resizeMode="cover"
                />
              ) : (
                <Video
                  ref={videoRef}
                  source={{
                    uri: (ad as VideoAd).video,
                  }}
                  style={styles.videoAd}
                  useNativeControls
                  shouldPlay
                  onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
                  onLoad={handleVideoMount}
                  pointerEvents="none"
                  resizeMode={ResizeMode.COVER}
                />
              )}
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>
        <Modal
          visible={ctaModalOpen}
          transparent={true}
          animationType="none"
          style={{ zIndex: 50 }}
        >
          <BlurView intensity={100} style={styles.container}>
            <Animated.View
              style={[styles.ctaModalContainer, buttonsModalStyle]}
            >
              <View style={styles.ctaModalButtonsContainer}>
                <AppButton
                  text="Posjeti link"
                  variant="primary"
                  buttonStyle={{ width: "100%" }}
                  onPress={() => {
                    handleClose();
                    handleAdClick();
                  }}
                />
                <AppButton
                  text="Zatvori"
                  variant="secondary"
                  buttonStyle={{ width: "100%" }}
                  onPress={() => {
                    handleClose();
                  }}
                />
              </View>
            </Animated.View>
          </BlurView>
        </Modal>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    height: "100%",
    width: "100%",
  },

  body: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    width: "100%",
  },

  adCointainer: {
    height: "100%",
    width: "100%",
  },

  imageAd: {
    minWidth: "100%",
    maxWidth: "100%",
    width: "100%",
    height: "100%",
    minHeight: "100%",
    maxHeight: "100%",
  },

  videoAd: {
    minWidth: "100%",
    maxWidth: "100%",
    width: "100%",
    height: "100%",
    minHeight: "100%",
    maxHeight: "100%",
  },

  closeAdContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    transform: [{ translateY: CLOSE_BUTTON_SIZE }],
    alignItems: "center",
    justifyContent: "center",
    zIndex: 50,
    borderRadius: 50,
  },

  closeAdButtonText: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },

  ctaModalContainer: {
    position: "absolute",
    width: "100%",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.light.gray,
    top: "100%",
    left: 0,
    height: 200,
  },

  ctaModalButtonsContainer: {
    gap: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  progressBar: {
    position: "absolute",
    top: "100%",
    left: 0,
    transform: [{ translateY: -10 }],
    height: 10,
    zIndex: 50,
  },
});
