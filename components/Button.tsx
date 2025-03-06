import { Colors } from "@/constants/Colors";
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  useColorScheme,
} from "react-native";

type Props = TouchableOpacityProps & {
  text: string;
  buttonStyle?: StyleProp<any>;
  textStyle?: StyleProp<TextStyle>;
  variant?: "primary" | "secondary" | "ghost" | "outlined";
};

export default function AppButton({
  text,
  buttonStyle = {},
  textStyle = {},
  variant = "primary",
  ...other
}: Props) {
  const colorScheme = useColorScheme();

  return (
    <TouchableOpacity
      style={[
        variant === "secondary"
          ? { backgroundColor: Colors[colorScheme ?? "light"].secondary }
          : variant === "ghost"
          ? { backgroundColor: "transparent" }
          : variant === "outlined"
          ? {
              borderWidth: 3,
              borderColor: Colors[colorScheme ?? "light"].secondary,
            }
          : { backgroundColor: Colors[colorScheme ?? "light"].primary },
        styles.defaultStyle,
        buttonStyle,
      ]}
      {...other}
    >
      <Text
        style={[
          variant === "secondary"
            ? { color: Colors[colorScheme ?? "light"].secondaryForeground }
            : variant === "ghost"
            ? { color: Colors.light.tint }
            : variant === "outlined"
            ? { color: Colors[colorScheme ?? "light"].secondary }
            : { color: Colors[colorScheme ?? "light"].primaryForeground },
          styles.text,
          textStyle,
        ]}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    textAlign: "center",
  },

  defaultStyle: {
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
});
