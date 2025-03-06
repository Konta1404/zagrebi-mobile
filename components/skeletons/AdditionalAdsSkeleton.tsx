import { StyleSheet } from "react-native";
import { ThemedView } from "../ThemedView";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { useEffect } from "react";
import { Colors } from "@/constants/Colors";

export default function AdditionalAdsSkeleton() {
  const opacity = useSharedValue(0.8);

  const cardStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  useEffect(() => {
    opacity.value = withRepeat(withTiming(0.5, { duration: 1000 }), -1, true);
  }, []);

  return (
    <ThemedView style={styles.container}>
      <Animated.View style={[styles.skeleton, cardStyle]} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
  },

  skeleton: {
    backgroundColor: Colors.light.gray,
    width: "100%",
    height: "100%",
  },
});
