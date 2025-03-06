import {
  StyleSheet,
  SafeAreaView,
  useColorScheme,
  TouchableOpacity,
  View,
} from "react-native";

import { ThemedView } from "@/components/ThemedView";
import { GiftScreenIcon } from "@/components/gifts/GiftScreenIcon";
import { Colors } from "@/constants/Colors";
import AdCardSlider from "@/components/AdCardSlider";
import GiftsSection from "@/components/gifts/GiftsSection";
import { useState } from "react";
import SearchModal from "@/components/modals/SearchModal";
import ClaimGiftModal from "@/components/modals/ClaimGiftModal";

export default function GiftScreen() {
  const [openSearchModal, setOpenSearchModal] = useState(false);
  const [openClaimGiftModal, setOpenClaimGiftModal] = useState(false);
  const colorScheme = useColorScheme();

  return (
    <>
      <ThemedView style={styles.container}>
        <SafeAreaView>
          <ThemedView style={[styles.body]}>
            <View style={{ flex: 2 }}>
              <ThemedView style={styles.header}>
                <TouchableOpacity onPress={() => setOpenSearchModal(true)}>
                  <GiftScreenIcon
                    name="search"
                    style={{
                      color: Colors[colorScheme ?? "light"].text,
                    }}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setOpenClaimGiftModal(true)}>
                  <GiftScreenIcon
                    name="gift"
                    style={{
                      color: Colors[colorScheme ?? "light"].text,
                    }}
                  />
                </TouchableOpacity>
              </ThemedView>
              <AdCardSlider
                style={{ height: 180, marginVertical: 10 }}
                bodyPadding={10}
                screen="pokloni"
              />
            </View>
            <View style={{ flex: 3 }}>
              <GiftsSection />
            </View>
          </ThemedView>
        </SafeAreaView>
      </ThemedView>
      <SearchModal open={openSearchModal} setOpen={setOpenSearchModal} />
      <ClaimGiftModal
        open={openClaimGiftModal}
        setOpen={setOpenClaimGiftModal}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  body: {
    paddingHorizontal: 10,
    paddingVertical: 30,
    rowGap: 20,
    height: "100%",
  },

  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 20,
  },

  content: {
    flex: 1,
    padding: 32,
    gap: 16,
    overflow: "hidden",
  },
});
