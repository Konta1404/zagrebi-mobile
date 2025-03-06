import { Client, ImageAd, VideoAd } from "@/lib/types";
import { useContext, useEffect, useState } from "react";
import AdModal from "./modals/AdModal";
import { getPriorityAd, updateAdAnalytics } from "@/lib/apiUtil";
import { ClientContent, ClientContext } from "@/lib/context";

type ModalAd = (ImageAd | VideoAd) & {
  _id?: string;
  isFallback: boolean;
};

type Props = {
  screen: "main" | "bonusi" | "pokloni" | "main-cta";
  open: boolean;
  setOpen: (s: any) => void;
};

export default function AdModalContainer({
  screen = "main-cta",
  open,
  setOpen,
}: Props) {
  const [ad, setAd] = useState<ModalAd | null>(null);
  const [seconds, setSeconds] = useState(0);

  const { setClient } = useContext<ClientContent>(ClientContext);

  const populateAd = async () => {
    const adData = await getPriorityAd(screen);

    if (adData.status === "success") {
      setAd({ ...adData.data, isFallback: false });

      if (screen === "main-cta")
        setClient((prev: Client) => ({ ...prev, hasAdditionalScratch: true }));
      if (screen === "bonusi")
        setClient((prev: Client) => ({ ...prev, tokens: (prev.tokens += 5) }));
    } else
      setAd({
        isFallback: true,
        image: "",
        name: "Zagrebi reklama",
        link: "https://zagrebi.me",
      } as any);
  };

  useEffect(() => {
    if (!open && ad) {
      updateAdAnalytics(ad._id, seconds);
    }
  }, [open, ad]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (open) {
      populateAd();

      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      setAd(null);
      setSeconds(0);
      if (interval) clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [open]);

  return ad && <AdModal ad={ad} open={open} setOpen={setOpen}></AdModal>;
}
