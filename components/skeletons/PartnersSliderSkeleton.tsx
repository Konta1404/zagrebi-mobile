import { StyleSheet, ViewProps } from "react-native";
import { ThemedView } from "../ThemedView";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { useEffect } from "react";
import { Colors } from "@/constants/Colors";

const CARD_WIDTH = 75;

export default function PartnersSliderSkeleton({ style = {} }: ViewProps) {
  const opacity = useSharedValue(0.8);

  const cardStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: Colors.light.gray,
      opacity: opacity.value,
    };
  });

  useEffect(() => {
    opacity.value = withRepeat(withTiming(0.5, { duration: 1000 }), -1, true);
  }, []);

  return (
    <ThemedView style={[styles.container, style]}>
      <Animated.View style={[cardStyle, styles.card]} />
      <Animated.View style={[cardStyle, styles.card]} />
      <Animated.View style={[cardStyle, styles.card]} />
      <Animated.View style={[cardStyle, styles.card]} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 10,
  },

  card: {
    height: CARD_WIDTH,
    width: CARD_WIDTH,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.light.gray,
  },
});
