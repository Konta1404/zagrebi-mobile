import { createContext, Dispatch, SetStateAction } from "react";
import { Client, Settings } from "./types";

export type ClientContent = {
  client: Client;
  setClient: Dispatch<SetStateAction<Client>>;
};

export const ClientContext = createContext<ClientContent>({
  client: {
    _id: "",
    hasAdditionalScratch: false,
    scratches: 5,
    tokens: 0,
    unclaimedGifts: [],
  },
  setClient: () => {},
});

export type SettingsContent = {
  settings: Settings;
  setSettings: Dispatch<SetStateAction<Settings>>;
};

export const SettingsContext = createContext<SettingsContent>({
  settings: { theme: "light", soundMuted: false, soundVolume: 1 },
  setSettings: () => {},
});
