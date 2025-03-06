import { useContext, useEffect, useState } from "react";
import AppButton from "./Button";
import ScratchCard from "./ScratchCard";
import { ThemedView } from "./ThemedView";
import { useImage } from "@shopify/react-native-skia";
import { StyleSheet, View } from "react-native";
import { Colors } from "@/constants/Colors";
import { ClientContent, ClientContext } from "@/lib/context";
import { getLimit } from "@/lib/apiUtil";

export default function ScratchCardContainer() {
  const [limit, setLimit] = useState(5);
  const [click, setClick] = useState(0);

  const { client } = useContext<ClientContent>(ClientContext);

  const image = useImage(require("@/assets/images/scratch.png"));

  const populateLimit = async () => {
    const limitData = await getLimit();
    if (limitData.status === "success") setLimit(limitData.data);
  };

  useEffect(() => {
    populateLimit();
  }, []);

  return (
    <ThemedView style={{ gap: 10 }}>
      {!image ? (
        <View style={styles.placeholder}></View>
      ) : (
        <ScratchCard
          image={image}
          click={click}
          limit={limit}
        />
      )}

      <AppButton
        text={
          client.scratches === 0 || client?.hasAdditionalScratch
            ? "Zagrebi"
            : (client?.scratches ?? 0) >= limit
            ? "Odgledaj reklamu za novo grebanje"
            : `Iskoristili ste ${client?.scratches}/${limit}`
        }
        onPress={() => setClick((prev) => (prev += 1))}
        textStyle={{
          fontWeight: "bold",
          textTransform: "uppercase",
          fontSize: 12,
        }}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  placeholder: {
    position: "relative",
    height: 175,
    overflow: "hidden",
    borderRadius: 10,
    width: "100%",
    backgroundColor: Colors.light.gray,
  },
});
