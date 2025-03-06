import {
  Dimensions,
  Image,
  Linking,
  StyleSheet,
  TouchableOpacity,
  ViewProps,
} from "react-native";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import { useEffect, useState } from "react";
import { ImageAd } from "@/lib/types";
import AdditionalAdsSkeleton from "./skeletons/AdditionalAdsSkeleton";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { getAdditionalAds } from "@/lib/apiUtil";
import { Colors } from "@/constants/Colors";

const { width } = Dimensions.get("window");
const ANIMATION_DURATION_PER_AD = 5000;

type Props = ViewProps & {
  bodyPadding?: number;
};

export default function AdditionalAds({ bodyPadding = 0 }: Props) {
  const [loading, setLoading] = useState(true);
  const [ads, setAds] = useState<ImageAd[]>([]);

  const scrollX = useSharedValue(0);
  const effectiveWidth = width - 2 * bodyPadding;

  const cardContainerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: scrollX.value }],
  }));

  const populateAds = async () => {
    const adsData = await getAdditionalAds();
    if (adsData.status === "success") setAds(adsData.data);
    setLoading(false);
  };

  const handleClick = (url: string) => {
    Linking.openURL(url);
  };

  useEffect(() => {
    populateAds();
  }, []);

  useEffect(() => {
    if (ads.length > 1) {
      scrollX.value = withRepeat(
        withTiming(-(effectiveWidth * ads.length + 10 * ads.length), {
          duration: ANIMATION_DURATION_PER_AD * ads.length,
          easing: Easing.linear,
        }),
        -1
      );
    }
  }, [ads]);

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.heading}>Dodatne reklame</ThemedText>
      {loading ? (
        <AdditionalAdsSkeleton />
      ) : (
        <Animated.View style={[styles.adsContainer, cardContainerStyle]}>
          {ads.length > 1
            ? ads.concat(ads).map((ad, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.card}
                  onPress={() => handleClick(ad.link)}
                >
                  <Image
                    source={{
                      uri: ad.image,
                    }}
                    alt={ad.name}
                    style={{ height: "100%" }}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              ))
            : !!ads.length && (
                <TouchableOpacity
                  style={styles.card}
                  onPress={() => handleClick(ads[0].link)}
                >
                  <Image
                    source={{
                      uri: ads[0].image,
                    }}
                    alt={ads[0].name}
                    style={{ height: "100%" }}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              )}
        </Animated.View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    gap: 10,
  },
  heading: {
    fontWeight: "bold",
    fontSize: 18,
  },
  adsContainer: {
    flexDirection: "row",
    height: "95%",
    gap: 10,
  },
  card: {
    borderWidth: 1,
    borderColor: Colors.light.gray,
    height: "100%",
    width: "100%",
  },
});
