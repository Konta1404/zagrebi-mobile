import { useEffect, useState } from "react";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import { getGifts } from "@/lib/apiUtil";
import GiftsSectionSkeleton from "../skeletons/GiftsSectionSkeleton";
import { Dimensions, FlatList, Image, StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";
import { Gift } from "@/lib/types";

export default function GiftsSection() {
  const [loading, setLoading] = useState(true);
  const [gifts, setGifts] = useState<Gift[]>([]);

  const populateGifts = async () => {
    const data = await getGifts();
    if (data.status === "success") setGifts(data.data);
    setLoading(false);
  };

  useEffect(() => {
    populateGifts();
  }, []);

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={{ fontSize: 20, fontWeight: "bold" }}>
        Dostupni Pokloni
      </ThemedText>
      {loading ? (
        <GiftsSectionSkeleton />
      ) : (
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
                      style={{ fontSize: 12, maxWidth: 170, lineHeight: 15 }}
                      numberOfLines={2}
                    >
                      {item.description}
                    </ThemedText>
                  )}
                  {!!item.validTill && (
                    <ThemedText
                      style={{ fontSize: 11, color: Colors.light.gray }}
                    >
                      Važi do {new Date(item.validTill).toLocaleDateString()}
                    </ThemedText>
                  )}
                </ThemedView>
              </ThemedView>
            </ThemedView>
          )}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    rowGap: 20,
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
