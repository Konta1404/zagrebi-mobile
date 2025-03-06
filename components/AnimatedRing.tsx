import React, { useEffect } from "react";
import Svg, { Circle } from "react-native-svg";
import Animated, {
  Easing,
  useSharedValue,
  withTiming,
  useAnimatedProps,
} from "react-native-reanimated";
import { useColorScheme } from "react-native";
import { Colors } from "@/constants/Colors";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const AnimatedRing = ({ size = 30, duration = 10000 }) => {
  const colorScheme = useColorScheme();
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(1, {
      duration: duration,
      easing: Easing.linear,
    });
  }, [progress]);

  const animatedProps = useAnimatedProps(() => {
    return {
      strokeDashoffset: (1 - progress.value) * 2 * Math.PI * (size / 4),
    };
  });

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <Circle
        cx={size / 2}
        cy={size / 2}
        r={size / 4}
        stroke={Colors[colorScheme ?? "light"].tint}
        strokeWidth="3"
        fill="none"
      />
      <AnimatedCircle
        cx={size / 2}
        cy={size / 2}
        r={size / 4}
        stroke={Colors[colorScheme ?? "light"].gray}
        strokeWidth="3"
        fill="none"
        strokeDasharray={2 * Math.PI * (size / 4)}
        animatedProps={animatedProps}
      />
    </Svg>
  );
};

export default AnimatedRing;
