import { Tabs } from "expo-router";
import React from "react";

import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import Sound from "@/components/Sound";
import UnclaimedGift from "@/components/UnclaimedGift";
import LogoIcon from "@/components/navigation/LogoIcon";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <>
      <Sound />
      <UnclaimedGift />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="gifts"
          options={{
            title: "Pokloni",
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={focused ? "gift" : "gift-outline"}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="index"
          options={{
            title: "",
            tabBarIcon: ({ focused }) => <LogoIcon focused={focused} />,
          }}
        />
        <Tabs.Screen
          name="bonuses"
          options={{
            title: "Bonusi",
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={focused ? "ribbon" : "ribbon-outline"}
                color={color}
              />
            ),
          }}
        />
      </Tabs>
    </>
  );
}
