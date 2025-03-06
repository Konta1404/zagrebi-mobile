import { FlatList, StyleSheet, useColorScheme } from "react-native";
import { ThemedView } from "../ThemedView";
import { Colors } from "@/constants/Colors";
import { useEffect } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

export default function GiftsSectionSkeleton() {
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
    <FlatList
      style={{ height: "100%" }}
      data={Array(2).fill(null)}
      keyExtractor={(_, idx) => String(idx)}
      renderItem={() => (
        <ThemedView style={styles.giftContainer}>
          <ThemedView style={styles.containerLeft}>
            <Animated.View style={[cardStyle, styles.imageContainer]} />
            <ThemedView style={{ rowGap: 7 }}>
              <Animated.View
                style={[
                  cardStyle,
                  {
                    height: 20,
                    width: 100,
                    borderRadius: 10,
                  },
                ]}
              />
              <Animated.View
                style={[
                  cardStyle,
                  {
                    height: 16,
                    width: 75,
                    borderRadius: 10,
                  },
                ]}
              />
              <Animated.View
                style={[
                  cardStyle,
                  {
                    height: 16,
                    width: 75,
                    borderRadius: 10,
                  },
                ]}
              />
            </ThemedView>
          </ThemedView>
          <ThemedView style={{ rowGap: 8 }}>
            <Animated.View
              style={[
                cardStyle,
                {
                  height: 16,
                  width: 50,
                  borderRadius: 10,
                },
              ]}
            />
            <Animated.View
              style={[
                cardStyle,
                {
                  height: 16,
                  width: 25,
                  borderRadius: 10,
                },
              ]}
            />
          </ThemedView>
        </ThemedView>
      )}
    />
  );
}

const styles = StyleSheet.create({
  giftContainer: {
    flexDirection: "row",
    columnGap: 10,
    justifyContent: "space-between",
  },

  containerLeft: {
    flexDirection: "row",
    columnGap: 10,
  },

  imageContainer: {
    overflow: "hidden",
    backgroundColor: "#fff",
    borderRadius: 10,
    borderColor: Colors.light.gray,
    borderWidth: 1,
    height: 75,
    width: 75,
    marginBottom: 10,
  },
});
