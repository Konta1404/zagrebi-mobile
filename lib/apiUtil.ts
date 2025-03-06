import { API_URL } from "./config";
import { Client, Gift, GiftWinner, ImageAd, Partner, VideoAd } from "./types";

interface IResponseData<T> {
  status: "success";
  data: T;
}

interface IErrorResponseData {
  status: "error" | "fail";
  message: string;
}

let CLIENT_ID: string | null = null;

const errorResponse = (error?: any): IErrorResponseData => {
  try {
    return {
      status: "error",
      message: error?.message ?? error?.toString() ?? "Pokušajte kasnije",
    };
  } catch {
    return {
      status: "error",
      message: "Pokušajte kasnije",
    };
  }
};

export const getClient = async (
  clientId: string
): Promise<IResponseData<Client> | IErrorResponseData> => {
  try {
    const res = await fetch(`${API_URL}/clients/${clientId}`);
    const data = await res.json();
    if (data.status === "success") CLIENT_ID = clientId;
    return data;
  } catch (error: any) {
    return errorResponse(error);
  }
};

export const createClient = async (): Promise<
  IResponseData<Client> | IErrorResponseData
> => {
  try {
    const res = await fetch(`${API_URL}/clients`, {
      method: "POST",
    });
    const data = await res.json();

    if (data.status === "success") CLIENT_ID = data.data._id;

    return data;
  } catch (error: any) {
    return errorResponse(error);
  }
};

export const getImageAds = async (
  screen = "main"
): Promise<IResponseData<ImageAd[]> | IErrorResponseData> => {
  try {
    const res = await fetch(`${API_URL}/ads/image?screen=${screen}`);
    const data = await res.json();
    return data;
  } catch (error: any) {
    return errorResponse(error);
  }
};
export const getAdditionalAds = async (): Promise<
  IResponseData<ImageAd[]> | IErrorResponseData
> => {
  try {
    const res = await fetch(`${API_URL}/ads/additional`);
    const data = await res.json();
    return data;
  } catch (error: any) {
    return errorResponse(error);
  }
};

export const getGifts = async (): Promise<
  IResponseData<Gift[]> | IErrorResponseData
> => {
  try {
    const res = await fetch(`${API_URL}/gifts`);
    const data = await res.json();
    return data;
  } catch (error: any) {
    return errorResponse(error);
  }
};

export const getSearchedGifts = async (
  val: string
): Promise<IResponseData<Gift[]> | IErrorResponseData> => {
  try {
    const res = await fetch(`${API_URL}/gifts/search?q=${val.trim()}`);
    const data = await res.json();
    return data;
  } catch (error: any) {
    return errorResponse(error);
  }
};

export const getPartners = async (): Promise<
  IResponseData<Partner[]> | IErrorResponseData
> => {
  try {
    const res = await fetch(`${API_URL}/partners`);
    const data = await res.json();
    return data;
  } catch (error: any) {
    return errorResponse(error);
  }
};

export const handleScratch = async (): Promise<
  | IResponseData<{ gift: Gift | null; giftWinner: GiftWinner | null }>
  | IErrorResponseData
> => {
  try {
    const res = await fetch(`${API_URL}/scratch`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        clientId: CLIENT_ID,
      }),
    });
    const data = await res.json();
    return data;
  } catch (error: any) {
    return errorResponse(error);
  }
};

export const getLimit = async (): Promise<
  IResponseData<number> | IErrorResponseData
> => {
  try {
    const res = await fetch(`${API_URL}/options/limit`);
    const data = await res.json();
    return data;
  } catch (error: any) {
    return errorResponse(error);
  }
};

export const getPriorityAd = async (
  screen = "main-cta"
): Promise<IResponseData<ImageAd | VideoAd> | IErrorResponseData> => {
  try {
    const res = await fetch(
      `${API_URL}/ads/priority?clientId=${CLIENT_ID}&screen=${screen}`
    );
    const data = await res.json();
    return data;
  } catch (error: any) {
    return errorResponse(error);
  }
};

export const updateAdAnalytics = async (
  adId: string | undefined,
  watchTime?: number,
  timesClicked?: number
): Promise<IResponseData<null> | IErrorResponseData> => {
  const obj: any = {
    adId,
  };

  if (watchTime !== undefined) obj.watchTime = watchTime;
  if (timesClicked !== undefined) obj.timesClicked = 1;

  try {
    const res = await fetch(`${API_URL}/analytics/ad`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(obj),
    });
    const data = await res.json();
    return data;
  } catch (error: any) {
    return errorResponse(error);
  }
};

export const convertTokens = async (): Promise<
  IResponseData<Client> | IErrorResponseData
> => {
  try {
    const res = await fetch(`${API_URL}/clients/tokens`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ clientId: CLIENT_ID }),
    });
    const data = await res.json();
    return data;
  } catch (error: any) {
    return errorResponse(error);
  }
};

export const getGiftWinnerById = async (
  giftWinnerId: string
): Promise<IResponseData<GiftWinner> | IErrorResponseData> => {
  try {
    const res = await fetch(`${API_URL}/giftWinners/${giftWinnerId}`);
    const data = await res.json();
    return data;
  } catch (error: any) {
    return errorResponse(error);
  }
};

export const claimGiftByCode = async (
  code: string
): Promise<IResponseData<GiftWinner> | IErrorResponseData> => {
  try {
    const res = await fetch(`${API_URL}/giftWinners/claimByCode`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        clientId: CLIENT_ID,
        code: code.trim(),
      }),
    });
    const data = await res.json();
    return data;
  } catch (error: any) {
    return errorResponse(error);
  }
};
