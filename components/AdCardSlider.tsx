import { getImageAds } from "@/lib/apiUtil";
import { useEffect, useState } from "react";
import { ThemedView } from "./ThemedView";
import {
  Dimensions,
  Image,
  Linking,
  StyleSheet,
  TouchableOpacity,
  ViewProps,
} from "react-native";
import AdCardSliderSkeleton from "./skeletons/AdCardSliderSkeleton";
import { ThemedText } from "./ThemedText";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { Colors } from "@/constants/Colors";
import { ImageAd } from "@/lib/types";

type Props = ViewProps & {
  bodyPadding?: number;
  screen?: string;
};

const { width } = Dimensions.get("window");
const ANIMATION_DURATION_PER_AD = 5000;

export default function AdCardSlider({
  style = {},
  bodyPadding = 0,
  screen = "main",
}: Props) {
  const [loading, setLoading] = useState(true);
  const [cards, setCards] = useState<ImageAd[]>([]);
  const [error, setError] = useState("");

  const scrollX = useSharedValue(0);
  const effectiveWidth = width - 2 * bodyPadding - 20;

  const cardContainerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: scrollX.value }],
  }));

  const populateCards = async () => {
    const data = await getImageAds(screen);
    if (data.status === "success") setCards(data.data);
    else setError(data.message as string);
    setLoading(false);
  };

  useEffect(() => {
    populateCards();
  }, []);

  useEffect(() => {
    if (cards.length > 1) {
      scrollX.value = withRepeat(
        withTiming(-(effectiveWidth * cards.length + 10 * cards.length), {
          duration: ANIMATION_DURATION_PER_AD * cards.length,
          easing: Easing.linear,
        }),
        -1
      );
    }
  }, [cards]);

  return (
    <ThemedView style={[style]}>
      {loading ? (
        <AdCardSliderSkeleton style={{ height: 180 }} bodyPadding={10} />
      ) : !!error ? (
        <ThemedText style={{ color: "red" }} numberOfLines={2}>
          {error}
        </ThemedText>
      ) : (
        <Animated.View style={[styles.cardContainer, cardContainerStyle]}>
          {cards.length > 1
            ? cards.concat(cards).map((card, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={[{ width: effectiveWidth }, styles.card]}
                  onPress={() => Linking.openURL(card.link)}
                >
                  <Image
                    source={{
                      uri: card.image,
                    }}
                    alt={card.name}
                    style={styles.img}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              ))
            : !!cards.length && (
                <TouchableOpacity
                  style={[{ width: effectiveWidth }, styles.card]}
                  onPress={() => Linking.openURL(cards[0].link)}
                >
                  <Image
                    source={{
                      uri: cards[0].image,
                    }}
                    alt={cards[0].name}
                    style={styles.img}
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
  cardContainer: {
    flexDirection: "row",
    gap: 10,
    height: "100%",
  },
  card: {
    position: "relative",
    height: "100%",
    borderRadius: 10,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.light.gray,
  },
  img: {
    height: "100%",
    width: "100%",
    maxHeight: "100%",
    maxWidth: "100%",
    minHeight: "100%",
    minWidth: "100%",
  },
});
