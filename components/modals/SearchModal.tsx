import {
  Dimensions,
  FlatList,
  Image,
  Modal,
  ModalProps,
  SafeAreaView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import { useEffect, useState } from "react";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { getSearchedGifts } from "@/lib/apiUtil";
import { Gift } from "@/lib/types";

type Props = ModalProps & {
  open: boolean;
  setOpen: (s: any) => void;
};

export default function SearchModal({ open, setOpen }: Props) {
  const [text, setText] = useState("");
  const [gifts, setGifts] = useState<Gift[]>([]);
  const colorScheme = useColorScheme();

  const onChangeText = (val: string) => {
    setText(val);
  };

  const handleSearch = async (val: string) => {
    const data = await getSearchedGifts(val);
    if (data.status === "success") setGifts(data.data);
    else setGifts([]);
  };

  const handleClose = () => {
    setText("");
    setOpen(false);
  };

  useEffect(() => {
    if (text.trim()) {
      handleSearch(text.trim());
    } else {
      setGifts([]);
    }
  }, [text]);

  return (
    <Modal visible={open} transparent animationType="slide">
      <ThemedView style={styles.container}>
        <SafeAreaView>
          <ThemedView style={styles.body}>
            <ThemedView style={styles.actionsContainer}>
              <TextInput
                style={styles.input}
                onChangeText={onChangeText}
                value={text}
                placeholder="Pretraži..."
                placeholderTextColor={Colors.light.gray}
                autoFocus
              />
              <TouchableOpacity onPress={handleClose}>
                <Ionicons
                  name="close"
                  size={30}
                  color={Colors[colorScheme ?? "light"].text}
                />
              </TouchableOpacity>
            </ThemedView>
            <ThemedText style={{ fontSize: 20 }}>
              Pretraži dostupne poklone
            </ThemedText>
            <FlatList
              style={{
                height: Math.floor(Dimensions.get("screen").height / 2.75),
              }}
              data={gifts}
              keyExtractor={(_, idx) => String(idx)}
              renderItem={({ item }) => (
                <ThemedView style={styles.giftContainer}>
                  <ThemedView style={styles.containerLeft}>
                    <ThemedView style={styles.imageContainer}>
                      <Image
                        source={{
                          uri: item.image,
                        }}
                        alt={item.name}
                        resizeMode="contain"
                        style={styles.image}
                      />
                    </ThemedView>
                    <ThemedView>
                      <ThemedText
                        style={{
                          fontWeight: "bold",
                          fontSize: 15,
                          textTransform: "uppercase",
                          maxWidth: 170,
                        }}
                        numberOfLines={1}
                      >
                        {item.name}
                      </ThemedText>
                      {!!item.description && (
                        <ThemedText
                          style={{
                            fontSize: 12,
                            maxWidth: 170,
                            lineHeight: 15,
                          }}
                          numberOfLines={2}
                        >
                          {item.description}
                        </ThemedText>
                      )}
                      {!!item.validTill && (
                        <ThemedText
                          style={{ fontSize: 11, color: Colors.light.gray }}
                        >
                          Važi do{" "}
                          {new Date(item.validTill).toLocaleDateString()}
                        </ThemedText>
                      )}
                    </ThemedView>
                  </ThemedView>
                  <ThemedView>
                    <ThemedText style={{ fontWeight: "bold", fontSize: 15 }}>
                      Kol.
                    </ThemedText>
                    <ThemedText
                      style={{
                        textAlign: "center",
                        fontSize: 12,
                        color: Colors.light.gray,
                      }}
                    >
                      {item.quantity}
                    </ThemedText>
                  </ThemedView>
                </ThemedView>
              )}
            />
          </ThemedView>
        </SafeAreaView>
      </ThemedView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
  },

  body: {
    padding: 10,
    gap: 20,
  },

  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },

  input: {
    borderRadius: 10,
    height: 40,
    backgroundColor: "#fff",
    color: Colors.light.gray,
    paddingHorizontal: 10,
    width: 250,
    borderWidth: 1,
    borderColor: Colors.light.gray,
  },

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
    position: "relative",
    overflow: "hidden",
    backgroundColor: "#fff",
    borderRadius: 10,
    borderColor: Colors.light.gray,
    borderWidth: 1,
    height: 75,
    width: 75,
    marginBottom: 10,
  },

  image: {
    height: "100%",
    width: "auto",
  },
});
