import { handleScratch } from "@/lib/apiUtil";
import {
  ClientContent,
  ClientContext,
  SettingsContent,
  SettingsContext,
} from "@/lib/context";
import { Client, Gift, GiftWinner } from "@/lib/types";
import {
  Canvas,
  Group,
  Mask,
  Rect,
  Skia,
  SkImage,
  Image,
  Path,
} from "@shopify/react-native-skia";
import { BlurView } from "expo-blur";
import React, { useContext, useEffect, useRef, useState } from "react";
import {
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
  Image as NativeImage,
  Text,
  Platform,
  useColorScheme,
} from "react-native";
import AdModalContainer from "./AdModalContainer";
import { Colors } from "@/constants/Colors";
import { Audio } from "expo-av";
import GiftModal from "./modals/GiftModal";
import HandScratchAnimation from "./HandScratchAnimation";

type Props = {
  style?: StyleProp<ViewStyle>;
  image: SkImage | null;
  click: number;
  limit: number;
};

const SCRATCH_CARD_HEIGHT = 175;

const ScratchCard = ({ style = {}, image, click, limit }: Props) => {
  const [[width, height], setSize] = useState([0, 0]);
  const [isScratched, setIsScratched] = useState(false);
  const [isMoved, setIsMoved] = useState(false);
  const [gift, setGift] = useState<Gift | null>(null);
  const [giftWinner, setGiftWinner] = useState<GiftWinner | null>(null);
  const [start, setStart] = useState(false);
  const [adModalOpen, setAdModalOpen] = useState(false);
  const [scratchSound, setScratchSound] = useState<Audio.Sound>();
  const [giftModalOpen, setGiftModalOpen] = useState(false);
  const [hasScratched, setHasScratched] = useState(false);

  const colorScheme = useColorScheme();

  const pageLoaded = useRef(false);
  const path = useRef(Skia.Path.Make());

  const { client, setClient } = useContext<ClientContent>(ClientContext);
  const { settings } = useContext<SettingsContent>(SettingsContext);

  const handleCardScratch = async () => {
    if (!start) {
      setHasScratched(true);
      const scratchData = await handleScratch();

      if (scratchData.status === "success") {
        setGift(scratchData.data.gift);
        setGiftWinner(scratchData.data.giftWinner || null);
        setStart(true);
        setClient((prev: Client) => ({
          ...prev,
          scratches: prev.hasAdditionalScratch
            ? prev.scratches
            : prev.scratches + 1,
          hasAdditionalScratch: false,
          tokens: !!scratchData.data.gift?.tokenAmount
            ? prev.tokens + scratchData.data.gift.tokenAmount
            : prev.tokens,
        }));
      }
    }
  };

  const calculateScratchedPercentage = () => {
    const scratchedBounds = path.current.computeTightBounds();
    const scratchedArea = scratchedBounds.width * scratchedBounds.height;
    const totalArea = width * height;

    return (scratchedArea / totalArea) * 100;
  };

  const handleTouchEnd = () => {
    const percentageScratched = calculateScratchedPercentage();

    if (isMoved && percentageScratched >= 80) {
      if (!isScratched && !gift) scratchSound?.replayAsync();
      setIsScratched(true);
    }
  };

  const handleReset = () => {
    path.current.reset();
    setStart(false);
    setIsMoved(false);
    setIsScratched(false);
    setGift(null);
  };

  const handleClick = () => {
    handleReset();

    if (client.scratches >= limit && !client.hasAdditionalScratch) {
      setAdModalOpen(true);
    }
  };

  const loadSound = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require("@/assets/sounds/scratch.mp3")
      );

      await sound.setIsMutedAsync(false);
      await sound.setVolumeAsync(1);

      setScratchSound(sound);
    } catch {}
  };

  const handleSettingsChange = async () => {
    try {
      await scratchSound?.setIsMutedAsync(settings?.soundMuted ?? false);
      await scratchSound?.setVolumeAsync(settings?.soundVolume ?? 1);
    } catch {}
  };

  useEffect(() => {
    loadSound();
  }, []);

  useEffect(() => {
    handleSettingsChange();
  }, [settings, scratchSound]);

  useEffect(() => {
    return scratchSound
      ? () => {
          scratchSound.unloadAsync();
        }
      : undefined;
  }, [scratchSound]);

  useEffect(() => {
    if (pageLoaded.current) handleClick();
    pageLoaded.current = true;
  }, [click]);

  useEffect(() => {
    if (isScratched && gift) {
      setGiftModalOpen(true);
    }
  }, [isScratched, gift]);

  return (
    <>
      <View
        style={[styles.container, style]}
        onLayout={(e) =>
          setSize([e.nativeEvent.layout.width, e.nativeEvent.layout.height])
        }
      >
        <HandScratchAnimation
          height={SCRATCH_CARD_HEIGHT}
          style={[
            styles.beforeScratchAnimationContainer,
            hasScratched ? { display: "none" } : {},
          ]}
        />
        {!!image && !!width && !!height && (
          <>
            {isMoved && (
              <View style={styles.rewardContainer}>
                {gift ? (
                  <>
                    <NativeImage
                      source={{
                        uri: gift.image,
                      }}
                      alt={gift.name}
                      style={{ height: "100%", width: "100%" }}
                      resizeMode="contain"
                    />
                    <BlurView
                      intensity={Platform.OS === "android" ? 100 : 30}
                      style={styles.giftDescription}
                    >
                      <Text
                        style={[
                          styles.giftDescriptionText,
                          {
                            color:
                              Platform.OS === "android"
                                ? "#000"
                                : Colors[colorScheme ?? "light"].text,
                          },
                        ]}
                        numberOfLines={2}
                      >
                        {gift.name}
                      </Text>
                    </BlurView>
                  </>
                ) : (
                  <>
                    <NativeImage
                      source={require("@/assets/images/lose.png")}
                      alt="Više sreće drugi put"
                      style={{ height: "100%" }}
                      resizeMode="contain"
                    />
                    <BlurView
                      intensity={Platform.OS === "android" ? 100 : 30}
                      style={styles.giftDescription}
                    >
                      <Text
                        style={[
                          styles.giftDescriptionText,
                          {
                            color:
                              Platform.OS === "android"
                                ? "#000"
                                : Colors[colorScheme ?? "light"].text,
                          },
                        ]}
                        numberOfLines={2}
                      >
                        Više sreće drugi put
                      </Text>
                    </BlurView>
                  </>
                )}
              </View>
            )}
            <Canvas
              style={styles.canvas}
              onTouchStart={({ nativeEvent }) => {
                if (client.scratches < limit || client.hasAdditionalScratch) {
                  path.current.moveTo(
                    nativeEvent.locationX,
                    nativeEvent.locationY
                  );
                  handleCardScratch();
                }
              }}
              onTouchMove={({ nativeEvent }) => {
                if (start) {
                  setIsMoved(true);
                  path.current.lineTo(
                    nativeEvent.locationX,
                    nativeEvent.locationY
                  );
                }
              }}
              onTouchEnd={handleTouchEnd}
            >
              <Mask
                mode="luminance"
                mask={
                  <Group>
                    <Rect
                      x={0}
                      y={0}
                      width={1000}
                      height={1000}
                      color={"white"}
                    />
                    <Path
                      path={path.current}
                      color={"black"}
                      style={"stroke"}
                      strokeJoin={"round"}
                      strokeCap={"round"}
                      strokeWidth={50}
                    />
                  </Group>
                }
              >
                {!isScratched && (
                  <Image
                    image={image}
                    fit={"cover"}
                    x={0}
                    y={0}
                    width={width}
                    height={height}
                  />
                )}
              </Mask>
            </Canvas>
          </>
        )}
      </View>
      <AdModalContainer
        screen="main-cta"
        open={adModalOpen}
        setOpen={setAdModalOpen}
      />
      <GiftModal
        gift={gift as Gift}
        giftWinner={giftWinner}
        open={giftModalOpen}
        setOpen={setGiftModalOpen}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    height: SCRATCH_CARD_HEIGHT,
    overflow: "hidden",
    borderRadius: 10,
    width: "100%",
  },

  canvas: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  },

  rewardContainer: {
    height: "100%",
    width: "100%",
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.light.gray,
  },

  giftDescription: {
    position: "absolute",
    height: 50,
    top: "100%",
    left: 0,
    transform: [{ translateY: -50 }],
    width: "100%",
    zIndex: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  giftDescriptionText: {
    textTransform: "uppercase",
    textAlign: "center",
    fontWeight: "bold",
  },

  beforeScratchAnimationContainer: {
    position: "absolute",
    top: "100%",
    left: 10,
  },
});

export default ScratchCard;
