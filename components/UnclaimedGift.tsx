import { getGiftWinnerById } from "@/lib/apiUtil";
import { ClientContent, ClientContext } from "@/lib/context";
import { Gift, GiftWinner } from "@/lib/types";
import { useContext, useEffect, useState } from "react";
import GiftModal from "./modals/GiftModal";

export default function UnclaimedGift() {
  const [modalOpen, setModalOpen] = useState(false);
  const [gift, setGift] = useState<Gift>();
  const [giftWinner, setGiftWinner] = useState<GiftWinner | null>(null);
  const [modalShown, setModalShown] = useState(false);

  const { client } = useContext<ClientContent>(ClientContext);

  const handleUnclaimedGift = async (giftWinnerId: string) => {
    const data = await getGiftWinnerById(giftWinnerId);

    if (data.status === "success") {
      setGift(data.data.gift);
      setGiftWinner(data.data);
      setModalOpen(true);
    }

    setModalShown(true);
  };

  useEffect(() => {
    if (!modalShown && !!client.unclaimedGifts?.length) {
      handleUnclaimedGift(String(client.unclaimedGifts[0]));
    }
  }, [client, modalShown]);

  return (
    <>
      {!!gift && (
        <GiftModal
          gift={gift}
          giftWinner={giftWinner}
          open={modalOpen}
          setOpen={setModalOpen}
        />
      )}
    </>
  );
}
