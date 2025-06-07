import { useEffect } from "react";

export const useBodyOverflow = (shouldDisable: boolean) => {
  useEffect(() => {
    if (shouldDisable) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [shouldDisable]);
};