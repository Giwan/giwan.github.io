import { useEffect } from "react";

export const useClickOutside = (
  isOpen: boolean,
  onClose: () => void,
  excludeSelectors: string[] = []
) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: Event) => {
      const target = e.target as Element;
      const isExcluded = excludeSelectors.some(selector => 
        target.closest(selector)
      );
      
      if (!isExcluded) {
        onClose();
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isOpen, onClose, excludeSelectors]);
};