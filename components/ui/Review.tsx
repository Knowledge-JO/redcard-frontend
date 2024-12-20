import Image from "next/image";
import { Button } from "./button";
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "./dialog";
import { ClipLoader } from "react-spinners";
import { createTelegramShareLink } from "@/lib/utils";

type ReviewType = {
  selectedCover: {
    url: string;
    text: string;
  };
  message: string;
  asset: string | undefined;
  tickets: number | undefined;
  amount: string | undefined;
  errorCreating: string;
  createdId: number | undefined;
  isCreating: boolean;
  isSuccess: boolean;
  handleCreateCheck: () => Promise<void>;
};

function Review({
  selectedCover,
  message,
  asset,
  tickets,
  amount,
  errorCreating,
  handleCreateCheck,
  createdId,
  isCreating,
  isSuccess,
}: ReviewType) {
  async function handleShare() {
    const url = createTelegramShareLink(
      `https://t.me/redcardfestivalbot?startapp=${createdId}`,
      "claim red packet"
    );
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.openTelegramLink(url);
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full bg-orange-600 hover:bg-orange-700 rounded-xl mt-5">
          Continue
        </Button>
      </DialogTrigger>

      <DialogContent className="w-fit rounded-xl">
        <DialogTitle>Review redcard</DialogTitle>

        <div className="w-60 mx-auto">
          <div className="w-60 h-72 relative rounded-xl">
            <Image
              src={selectedCover.url}
              alt=""
              fill
              className="object-cover rounded-xl"
            />
          </div>

          <div className="text-center text-sm">
            <p className="my-2">{message}</p>
            <p className="text-xs">
              {asset} Red envelope: {amount}
              {asset} / {tickets} tickets
            </p>
            {isSuccess ? (
              <Button
                className="w-full mt-2 bg-orange-600 hover:bg-orange-700 rounded-xl"
                onClick={handleShare}
              >
                Share
              </Button>
            ) : (
              <Button
                className="w-full mt-2 bg-orange-600 hover:bg-orange-700 rounded-xl"
                onClick={(e) => {
                  e.preventDefault();
                  handleCreateCheck();
                }}
                disabled={isCreating}
              >
                {isCreating ? <ClipLoader color="#fff" size={20} /> : "Create"}
              </Button>
            )}

            {errorCreating && (
              <p className="text-red-600 mt-1">{errorCreating}</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default Review;
