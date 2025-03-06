import { SettingsContent, SettingsContext } from "@/lib/context";
import { Settings } from "@/lib/types";
import { Ionicons } from "@expo/vector-icons";
import Entypo from "@expo/vector-icons/Entypo";
import Slider from "@react-native-community/slider";
import { BlurView } from "expo-blur";
import { useContext } from "react";
import {
  Modal,
  ModalProps,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Props = ModalProps & {
  open: boolean;
  setOpen: (s: any) => void;
};

export default function SettingsModal({ open, setOpen }: Props) {
  const { settings, setSettings } =
    useContext<SettingsContent>(SettingsContext);

  return (
    <Modal visible={open} transparent={true} animationType="fade">
      <BlurView intensity={50} style={styles.container}>
        <SafeAreaView style={styles.body}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setOpen(false)}
          >
            <Ionicons name="close" size={30} color="#000" />
          </TouchableOpacity>
          <View style={styles.dialog}>
            <Text style={styles.heading}>Podešavanja</Text>
            <View style={styles.settingsContainer}>
              <View style={styles.settingsItem}>
                <TouchableOpacity
                  onPress={() =>
                    setSettings((prev: Settings) => ({
                      ...prev,
                      soundMuted: !prev.soundMuted,
                    }))
                  }
                  style={styles.settingsActionButton}
                >
                  {!!settings?.soundMuted ? (
                    <View style={styles.iconContainer}>
                      <Entypo name="sound-mute" size={35} color="#000" />
                    </View>
                  ) : (
                    <View style={styles.iconContainer}>
                      <Entypo name="sound" size={35} color="#000" />
                    </View>
                  )}
                </TouchableOpacity>
                <Slider
                  minimumValue={0}
                  maximumValue={1}
                  style={{
                    width: 200,
                    height: 40,
                  }}
                  value={settings?.soundVolume ?? 1}
                  onValueChange={(val) => {
                    setSettings((prev: Settings) => ({
                      ...prev,
                      soundVolume: +val,
                      soundMuted: false,
                    }));
                  }}
                />
              </View>
              <View style={styles.settingsItem}>
                <TouchableOpacity
                  onPress={() => {
                    setSettings((prev: Settings) => ({
                      ...prev,
                      theme: prev.theme === "light" ? "dark" : "light",
                    }));
                  }}
                  style={styles.settingsActionButton}
                >
                  {settings?.theme === "dark" ? (
                    <View style={[styles.iconContainer, { marginRight: 20 }]}>
                      <Ionicons name="moon" size={35} color="#000" />
                    </View>
                  ) : (
                    <View style={[styles.iconContainer, { marginRight: 20 }]}>
                      <Ionicons name="sunny" size={35} color="#000" />
                    </View>
                  )}
                  <Text
                    style={{
                      color: "#000",
                      fontSize: 18,
                      textTransform: "uppercase",
                    }}
                  >
                    {settings?.theme === "dark"
                      ? "Tamna tema"
                      : "Svijetla tema"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </BlurView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },

  body: {
    width: "100%",
    alignItems: "center",
  },

  dialog: {
    position: "relative",
    borderWidth: 2,
    borderColor: "#000",
    borderRadius: 10,
    padding: 20,
    backgroundColor: "#fff",
    width: "90%",
    alignItems: "center",
    gap: 30,
  },

  closeButton: {
    position: "absolute",
    top: 15,
    left: "100%",
    transform: [{ translateX: -60 }],
    zIndex: 10,
  },

  heading: {
    textAlign: "center",
    fontSize: 20,
    textTransform: "uppercase",
    fontWeight: "bold",
  },

  settingsContainer: {
    width: "100%",
    gap: 20,
  },

  settingsItem: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    gap: 20,
  },

  iconContainer: {
    borderWidth: 2,
    borderColor: "#000",
    borderRadius: 10,
    padding: 5,
  },

  settingsActionButton: {
    flexDirection: "row",
    alignItems: "center",
  },
});
