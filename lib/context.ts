import { createContext } from "react";
import { Client, Settings } from "./types";

export type ClientContent = {
  client: Client;
  setClient: (s: any) => void;
};

export const ClientContext: any = createContext<ClientContent>({
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
  settings: Settings | null;
  setSettings: (s: any) => void;
};

export const SettingsContext: any = createContext<SettingsContent>({
  settings: null,
  setSettings: () => {},
});
