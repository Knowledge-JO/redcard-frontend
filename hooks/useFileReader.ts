import { Dispatch, SetStateAction, useEffect } from "react";

function useFileReader(
  imageFile: File | undefined,
  dispatch: Dispatch<SetStateAction<string>>
) {
  useEffect(() => {
    if (imageFile) {
      const reader = new FileReader();

      reader.onloadend = () => {
        if (reader.result instanceof ArrayBuffer) return;
        dispatch(reader.result ? reader.result : "");
      };
      reader.readAsDataURL(imageFile);
    }
  }, [imageFile, dispatch]);
}

export { useFileReader };
