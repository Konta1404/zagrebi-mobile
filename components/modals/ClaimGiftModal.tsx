import {
  Modal,
  ModalProps,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
} from "react-native";
import { ThemedView } from "../ThemedView";
import { Colors } from "@/constants/Colors";
import { BlurView } from "expo-blur";
import AppButton from "../Button";
import { useState } from "react";
import * as Updates from "expo-updates";
import { claimGiftByCode } from "@/lib/apiUtil";

type Props = ModalProps & {
  open: boolean;
  setOpen: (s: any) => void;
};

export default function ClaimGiftModal({ open, setOpen }: Props) {
  const [val, setVal] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const reloadApp = async () => {
    try {
      await Updates.reloadAsync();
    } catch (e) {
      setError("Restartujte aplikaciju za poklon");
    }
  };

  const handleSubmit = async () => {
    if (!val.trim()) {
      setError("Unesite validan kod");
      return;
    }

    const data = await claimGiftByCode(val);

    if (data.status === "success") {
      reloadApp();
    } else {
      setError(data.message);
    }
  };

  const handleChange = (val: string) => {
    setError("");
    setVal(val);
  };

  return (
    <Modal visible={open} transparent={true} animationType="fade">
      <BlurView intensity={50} style={styles.container}>
        <SafeAreaView style={styles.body}>
          <ThemedView style={styles.form}>
            <Text style={styles.heading}>Unesite kod koji ste dobili</Text>
            <Text style={styles.subheading}>
              Kako bi ste preuzeli poklon, potrebno je da unesete validan kod
            </Text>
            {!!error && (
              <Text style={styles.errorText} numberOfLines={3}>
                {error}
              </Text>
            )}
            <TextInput
              style={styles.input}
              placeholder="Unesite kod..."
              placeholderTextColor={Colors.light.gray}
              value={val}
              onChangeText={handleChange}
            />
            <AppButton
              text="Preuzmi poklon"
              variant="primary"
              buttonStyle={{ width: "100%" }}
              textStyle={{ fontSize: 18 }}
              disabled={loading}
              onPress={handleSubmit}
            />
            <AppButton
              text="Zatvori"
              variant="ghost"
              buttonStyle={{ width: "100%" }}
              textStyle={{ fontSize: 18 }}
              onPress={() => setOpen(false)}
            />
          </ThemedView>
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

  form: {
    borderWidth: 1,
    borderColor: Colors.light.gray,
    borderRadius: 10,
    padding: 20,
    backgroundColor: "#fff",
    width: "90%",
    alignItems: "center",
    gap: 15,
  },

  heading: {
    fontSize: 20,
  },

  subheading: {
    color: Colors.light.gray,
    textAlign: "center",
    fontSize: 15,
  },

  input: {
    borderColor: Colors.light.gray,
    borderWidth: 1,
    borderRadius: 10,
    width: "100%",
    height: 40,
    paddingHorizontal: 10,
  },

  errorText: {
    fontSize: 14,
    color: "red",
    textAlign: "center",
  },
});
