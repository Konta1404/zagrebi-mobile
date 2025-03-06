import { StyleSheet } from "react-native";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import * as Updates from "expo-updates";
import AppButton from "./Button";

export default function ErrorScreen({
  errorMessage = "Pokušajte kasnije",
}: {
  errorMessage?: string;
}) {
  const reloadApp = async () => {
    try {
      await Updates.reloadAsync();
    } catch {}
  };

  return (
    <ThemedView style={styles.body}>
      <ThemedText style={styles.heading}>Došlo je do greške</ThemedText>
      <ThemedText style={styles.subheading}>{errorMessage}</ThemedText>
      <AppButton
        text="Pokušaj ponovo"
        variant="ghost"
        buttonStyle={{ width: "100%" }}
        textStyle={{ fontSize: 18, textDecorationLine: "underline" }}
        onPress={reloadApp}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  body: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    gap: 10,
    paddingHorizontal: 10,
  },

  heading: {
    fontWeight: "bold",
    fontSize: 20,
    textAlign: "center",
  },

  subheading: {
    fontSize: 16,
    textAlign: "center",
  },
});
