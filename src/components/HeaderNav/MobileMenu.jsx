import { useStore } from "@nanostores/react";
import { createPortal } from "react-dom";
import { $isMobileMenuOpen } from "../../stores/mobileMenuStore";
import headerNavData from "./headerLinks.json";

const MobileMenu = ({ onClose }) => {
  const isOpen = useStore($isMobileMenuOpen);
  
  if (!isOpen) return null;

  // Rendered in a portal so the overlay escapes any ancestor `contain: layout`
  // (set on header/nav) that would otherwise trap the fixed positioning.
  return createPortal(
    <div className="mobile-menu-container fixed inset-0 bg-background border-r border-border" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999 }}>
      <div className="p-4 bg-background text-foreground flex justify-between items-center border-b border-border">
        <h2 className="font-heading text-2xl text-primary font-bold">Menu</h2>
        <button 
          onClick={onClose}
          className="focus-editorial rounded-none p-2 text-3xl text-muted-foreground transition-colors duration-200 hover:text-destructive focus:text-destructive"
          aria-label="Close navigation menu"
        >
          &times;
        </button>
      </div>
      
      <nav id="mobile-navigation" aria-label="Mobile navigation" className="p-6">
        <ul className="space-y-6">
          {headerNavData.map(({ label, href }) => (
            <li key={href} className="border-b border-border pb-4 last:border-b-0">
              <a 
                href={href}
                className="focus-editorial font-heading block border-l-4 border-transparent py-2 px-3 text-xl text-muted-foreground transition-all duration-300 hover:border-editorial hover:text-editorial focus:border-editorial focus:text-editorial"
                onClick={onClose}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>,
    document.body
  );
};

export default MobileMenu;