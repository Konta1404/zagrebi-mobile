import { useEffect } from "react";
import { Dimensions, StyleSheet, ViewProps } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import HandIcon from "./HandIcon";

type Props = ViewProps & {
  height: number;
};

const BODY_PADDING = 10;
const ICON_HEIGHT = 35;
const ICON_WIDTH = 30;

const { width } = Dimensions.get("window");

export default function HandScratchAnimation({ height, style }: Props) {
  const translateY = useSharedValue(-ICON_HEIGHT + 10);
  const translateX = useSharedValue(0);

  const effectiveWidth = width - 2 * BODY_PADDING;

  const animationStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: translateY.value },
        { translateX: translateX.value },
      ],
    };
  });

  useEffect(() => {
    const DURATION = 750;

    translateY.value = withRepeat(
      withSequence(
        withTiming(-ICON_HEIGHT + 10, {
          duration: DURATION,
          easing: Easing.linear,
        }),
        withTiming(-height, { duration: DURATION, easing: Easing.linear }),
        withTiming(-ICON_HEIGHT + 10, {
          duration: DURATION - 250,
          easing: Easing.linear,
        }),
        withTiming(-height, { duration: DURATION, easing: Easing.linear })
      ),
      -1
    );
    translateX.value = withRepeat(
      withSequence(
        withTiming(0, { duration: DURATION, easing: Easing.linear }),
        withTiming(Math.floor(effectiveWidth / 2 - ICON_WIDTH), {
          duration: DURATION,
          easing: Easing.linear,
        }),
        withTiming(Math.floor(effectiveWidth / 2 - ICON_WIDTH), {
          duration: DURATION - 250,
          easing: Easing.linear,
        }),
        withTiming(effectiveWidth - ICON_WIDTH, {
          duration: DURATION,
          easing: Easing.linear,
        })
      ),
      -1
    );
  }, []);

  return (
    <Animated.View style={[styles.container, animationStyle, style]}>
      <HandIcon style={styles.handIcon} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    zIndex: 50,
  },

  handIcon: {
    transform: [{ rotate: "-40deg" }],
  },
});
