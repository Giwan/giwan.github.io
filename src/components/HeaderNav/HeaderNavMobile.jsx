import { useStore } from "@nanostores/react";
import { useClickOutside } from "../../hooks/useClickOutside";
import { useBodyOverflow } from "../../hooks/useBodyOverflow";
import { $isMobileMenuOpen, closeMobileMenu, toggleMobileMenu } from "../../stores/mobileMenuStore";
import HamburgerButton from "./HamburgerButton";
import MobileMenu from "./MobileMenu";

const HeaderNav = () => {
  const isOpen = useStore($isMobileMenuOpen);
  
  const handleClose = () => closeMobileMenu();
  const handleToggle = () => toggleMobileMenu();
  
  useClickOutside(isOpen, handleClose, [".mobile-menu-container", ".menu-button"]);
  useBodyOverflow(isOpen);
  
  return (
    <div className="">
      <HamburgerButton isOpen={isOpen} onClick={handleToggle} />
      <MobileMenu isOpen={isOpen} onClose={handleClose} />
    </div>
  );
};

export default HeaderNav;
