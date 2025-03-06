import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useColorScheme } from "@/hooks/useColorScheme";
import ErrorScreen from "@/components/ErrorScreen";
import { createClient, getClient } from "@/lib/apiUtil";
import SettingsProvider from "@/components/settings-provider";
import { ClientContext } from "@/lib/context";
import { Client } from "@/lib/types";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [client, setClient] = useState<Client>({
    _id: "",
    hasAdditionalScratch: false,
    scratches: 5,
    tokens: 0,
    unclaimedGifts: [],
  });

  const authenticateClient = async () => {
    try {
      const clientId = await AsyncStorage.getItem("clientId");

      if (clientId !== null) {
        const clientData = await getClient(clientId);

        if (clientData.status !== "success") {
          const newClientData = await createClient();
          if (newClientData.status === "success") {
            await AsyncStorage.setItem("clientId", newClientData.data._id);
            setClient(newClientData.data);
          } else setError(newClientData.message ?? "Pokušajte kasnije");
        } else setClient(clientData.data);
      } else {
        const newClientData = await createClient();
        if (newClientData.status === "success") {
          await AsyncStorage.setItem("clientId", newClientData.data._id);
          setClient(newClientData.data);
        } else setError(newClientData.message ?? "Pokušajte kasnije");
      }
    } catch (error: any) {
      setError(error?.message ?? error?.toString() ?? "Pokušajte kasnije");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    authenticateClient();
  }, []);

  useEffect(() => {
    if (loaded && !loading) {
      SplashScreen.hideAsync();
    }
  }, [loaded, loading]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      {!!error ? (
        <ErrorScreen errorMessage={error} />
      ) : (
        <SettingsProvider>
          <ClientContext.Provider value={{ client, setClient }}>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="+not-found" />
            </Stack>
          </ClientContext.Provider>
        </SettingsProvider>
      )}
    </ThemeProvider>
  );
}
