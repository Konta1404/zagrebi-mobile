import {
  Image,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
} from "react-native";

import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import SettingsModal from "@/components/modals/SettingsModal";
import PartnersSlider from "@/components/PartnersSlider";
import AdCardSlider from "@/components/AdCardSlider";
import ScratchCardContainer from "@/components/ScratchCardContainer";

export default function HomeScreen() {
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);

  const colorScheme = useColorScheme();

  return (
    <>
      <ThemedView style={styles.container}>
        <ThemedView style={[styles.headerContainer, { flex: 1 }]}>
          <Image
            source={require("@/assets/images/zagrebi-header.png")}
            style={styles.headerImage}
          />
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => setSettingsModalOpen(true)}
          >
            <Ionicons
              name="settings-sharp"
              size={30}
              style={{ color: Colors[colorScheme ?? "light"].text }}
            />
          </TouchableOpacity>
        </ThemedView>
        <ThemedView
          style={[styles.body, { flex: 3, justifyContent: "center" }]}
        >
          <PartnersSlider bodyPadding={10} />
          <ScratchCardContainer />
          <AdCardSlider
            style={{ height: 150 }}
            bodyPadding={10}
            screen="main"
          />
        </ThemedView>
      </ThemedView>
      <SettingsModal open={settingsModalOpen} setOpen={setSettingsModalOpen} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  body: {
    padding: 10,
    gap: 10,
  },

  headerContainer: {
    position: "relative",
    height: "100%",
    width: "100%",
  },

  headerImage: {
    objectFit: "cover",
    height: "100%",
    width: "100%",
  },

  settingsButton: {
    position: "absolute",
    bottom: 0,
    right: 20,
  },
});
