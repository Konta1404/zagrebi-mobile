import { Dimensions, StyleSheet, ViewProps } from "react-native";
import { ThemedView } from "../ThemedView";
import { Colors } from "@/constants/Colors";
import { useEffect } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

type Props = ViewProps & {
  bodyPadding?: number;
};
const { width } = Dimensions.get("window");

export default function AdCardSliderSkeleton({
  style = {},
  bodyPadding = 0,
}: Props) {
  const opacity = useSharedValue(0.8);

  const cardStyle = useAnimatedStyle(() => {
    return {
      width: width - 2 * bodyPadding - 20,
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
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 10,
  },
  card: {
    height: "100%",
    borderRadius: 10,
  },
});
