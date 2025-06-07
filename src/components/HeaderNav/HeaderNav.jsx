import { useState } from "react";
import { useClickOutside } from "../../hooks/useClickOutside";
import { useBodyOverflow } from "../../hooks/useBodyOverflow";
import HamburgerButton from "./HamburgerButton";
import MobileMenu from "./MobileMenu";

const HeaderNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  const handleClose = () => setIsOpen(false);
  const handleToggle = () => setIsOpen(!isOpen);
  
  useClickOutside(isOpen, handleClose, [".mobile-menu-container", ".menu-button"]);
  useBodyOverflow(isOpen);
  
  return (
    <div className="relative">
      <HamburgerButton isOpen={isOpen} onClick={handleToggle} />
      <MobileMenu isOpen={isOpen} onClose={handleClose} />
    </div>
  );
};

export default HeaderNav;
