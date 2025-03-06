type Ad = {
  _id: string;
  name: string;
  link: string;
};

export type ImageAd = Ad & {
  image: string;
};

export type VideoAd = Ad & {
  video: string;
};

export enum GIFT_TYPE {
  COIN = "token",
  GIFT = "poklon",
  VOUCHER = "vaučer",
}

export type Gift = {
  _id: string;
  name: string;
  type: GIFT_TYPE;
  tokenAmount?: number;
  description?: string;
  image: string;
  quantity: string;
  validTill?: Date;
};

export type Client = {
  _id: string;
  scratches: number;
  hasAdditionalScratch: boolean;
  tokens: number;
  unclaimedGifts?: string[];
};

export type Settings = {
  theme: "dark" | "light";
  soundMuted: boolean;
  soundVolume: number;
};

export type Partner = {
  name: string;
  logo: string;
  link: string;
};

export type GiftWinner = {
  _id: string;
  gift: Gift;
};
