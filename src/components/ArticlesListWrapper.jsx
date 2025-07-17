import { useStore } from "@nanostores/react";
import { $isMobileMenuOpen } from "../stores/mobileMenuStore";

const ArticlesListWrapper = ({ children }) => {
  const isMobileMenuOpen = useStore($isMobileMenuOpen);
  
  // Don't render articles when mobile menu is open
  if (isMobileMenuOpen) {
    return null;
  }
  
  return <div>{children}</div>;
};

export default ArticlesListWrapper;