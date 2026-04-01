import { useStore } from "@nanostores/react";
import { $isMobileMenuOpen } from "../stores/mobileMenuStore";

/**
 * ConditionalContent component that conditionally renders its children
 * based on whether the mobile menu is open or not.
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Content to conditionally render
 * @param {boolean} [props.hideWhenMenuOpen=true] - Whether to hide content when menu is open
 * @returns {React.ReactNode|null} The children or null based on menu state
 */
const ConditionalContent = ({ children, hideWhenMenuOpen = true }) => {
  const isMobileMenuOpen = useStore($isMobileMenuOpen);
  
  return (
    <div className={isMobileMenuOpen && hideWhenMenuOpen ? 'hidden' : 'contents'}>
      {children}
    </div>
  );
};

export default ConditionalContent;