import { usePublicContext } from "@/context/PublicProvider";
import Image from "next/image";
import { Dispatch, SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import { HiMiniArrowTopRightOnSquare } from "react-icons/hi2";
const coverImages = [
  "https://oghibjysbqokcedkbicl.supabase.co/storage/v1/object/public/covers/cover1.jpg",
  "https://oghibjysbqokcedkbicl.supabase.co/storage/v1/object/public/covers/cover2.jpg",
  "https://oghibjysbqokcedkbicl.supabase.co/storage/v1/object/public/covers/cover3.jpg",
];

function Cover({
  setSelectedCover,
  setSelectedImage,
}: {
  setSelectedCover: Dispatch<
    SetStateAction<{
      url: string;
      text: string;
    }>
  >;
  setSelectedImage: Dispatch<SetStateAction<File | undefined>>;
}) {
  const { t } = useTranslation();

  const { setActiveId: close } = usePublicContext();

  function fileReader(image: FileList | null) {
    if (!image) return;
    const file = image[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      if (reader.result instanceof ArrayBuffer) return;
      setSelectedCover({ text: file.name, url: reader.result || "" });
    };
    reader.readAsDataURL(file);
  }
  return (
    <>
      <div className="mt-5 grid grid-cols-3 gap-2 justify-items-center px-3">
        {coverImages.map((cover, index) => (
          <div
            className="bg-gray-200 w-full rounded-xl"
            key={cover}
            onClick={() => {
              setSelectedCover({
                url: cover,
                text: (
                  t("image_covers.covers", {
                    returnObjects: true,
                  }) as string[]
                )[index],
              });

              close("");
            }}
          >
            <div className="relative h-44 rounded-xl w-full">
              <Image
                src={cover}
                alt=""
                fill
                className="object-cover rounded-xl"
              />
            </div>
            <p className="text-xs px-2 text-center text-stone-600 py-2">
              {
                (
                  t("image_covers.covers", {
                    returnObjects: true,
                  }) as string[]
                )[index]
              }
            </p>
          </div>
        ))}
      </div>
      <div className="px-3 py-5 mt-8 font-bold flex items-center gap-2 fixed bottom-0">
        <div className="flex text-white items-center px-2 py-2 bg-orange-600 hover:bg-orange-700 rounded-xl gap-1">
          <label htmlFor="cover-image" className="text-sm">
            Upload cover
          </label>
          <input
            className="hidden"
            id="cover-image"
            type="file"
            onChange={(e) => {
              if (!e.target.files) return;
              setSelectedImage(e.target.files[0]);
              fileReader(e.target.files);
              close("");
            }}
          />
          <HiMiniArrowTopRightOnSquare />
        </div>
      </div>
    </>
  );
}

export default Cover;
