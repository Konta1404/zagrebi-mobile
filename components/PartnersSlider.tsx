import {
  Image,
  Linking,
  StyleSheet,
  TouchableOpacity,
  ViewProps,
} from "react-native";
import { ThemedView } from "./ThemedView";
import { useEffect, useState } from "react";
import { Partner } from "@/lib/types";
import { getPartners } from "@/lib/apiUtil";
import PartnersSliderSkeleton from "./skeletons/PartnersSliderSkeleton";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { ThemedText } from "./ThemedText";
import { Colors } from "@/constants/Colors";

type Props = ViewProps & {
  bodyPadding?: number;
};

const ANIMATION_DURATION_PER_CARD = 3000;
const CARD_WIDTH = 75;

export default function PartnersSlider({ style = {}, bodyPadding = 0 }: Props) {
  const [loading, setLoading] = useState(true);
  const [cards, setCards] = useState<Partner[]>([]);
  const [error, setError] = useState("");

  const scrollX = useSharedValue(0);

  const cardContainerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: scrollX.value }],
  }));

  const populatePartners = async () => {
    const partnersData = await getPartners();
    if (partnersData.status === "success") setCards(partnersData.data);
    else setError(partnersData.message);
    setLoading(false);
  };

  useEffect(() => {
    populatePartners();
  }, []);

  useEffect(() => {
    if (cards.length > 4) {
      scrollX.value = withRepeat(
        withTiming(-(CARD_WIDTH * cards.length + 10 * cards.length), {
          duration: ANIMATION_DURATION_PER_CARD * cards.length,
          easing: Easing.linear,
        }),
        -1
      );
    }
  }, [cards]);

  return (
    <ThemedView>
      {loading ? (
        <PartnersSliderSkeleton />
      ) : !!error ? (
        <ThemedText style={{ color: "red" }} numberOfLines={2}>
          {error}
        </ThemedText>
      ) : (
        <Animated.View style={[styles.cardsContainer, cardContainerStyle]}>
          {cards.length > 4
            ? cards.concat(cards).map((card, idx) => (
                <TouchableOpacity
                  onPress={() => Linking.openURL(card.link)}
                  style={styles.card}
                  key={idx}
                >
                  <Image
                    source={{
                      uri: card.logo,
                    }}
                    alt={card.name}
                    resizeMode="cover"
                    style={{
                      height: "100%",
                      width: "100%",
                      borderRadius: 10,
                    }}
                  />
                </TouchableOpacity>
              ))
            : cards.map((card, idx) => (
                <ThemedView style={styles.card} key={idx}>
                  <Image
                    source={{
                      uri: card.logo,
                    }}
                    alt={card.name}
                    resizeMode="cover"
                    style={{
                      height: "100%",
                      width: "100%",
                      borderRadius: 10,
                    }}
                  />
                </ThemedView>
              ))}
        </Animated.View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  cardsContainer: {
    flexDirection: "row",
    gap: 10,
  },

  card: {
    position: "relative",
    height: CARD_WIDTH,
    width: CARD_WIDTH,
    borderRadius: 10,
    backgroundColor: "#fff",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.light.gray
  },
});
