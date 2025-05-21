import { useState, useEffect } from "react";
import ListItem from "./ListItem";
import headerNavData from "./headerLinks.json";

const HeaderNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Close menu when clicking outside
  useEffect(() => {
    if (isOpen) {
      const handleClickOutside = (e) => {
        if (!e.target.closest(".mobile-menu-container") && !e.target.closest(".menu-button")) {
          setIsOpen(false);
        }
      };
      
      document.addEventListener("click", handleClickOutside);
      // Prevent scrolling when menu is open
      document.body.style.overflow = "hidden";
      
      return () => {
        document.removeEventListener("click", handleClickOutside);
        document.body.style.overflow = "";
      };
    }
  }, [isOpen]);
  
  return (
    <div className="relative">
      {/* Menu Button */}
      {HamburgerMenu(setIsOpen, isOpen)}
      
      {/* Mobile Menu */}
      {isOpen && (
        <div className="mobile-menu-container fixed inset-0 z-50 bg-paper">
          <div className="p-4 bg-primary text-paper flex justify-between items-center">
            <h2 className="font-heading text-2xl">Menu</h2>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-3xl p-2"
              aria-label="Close menu"
            >
              &times;
            </button>
          </div>
          
          <nav className="p-4">
            <ul className="space-y-4">
              {headerNavData.map(({ label, href }) => (
                <li key={href} className="border-b border-border pb-3">
                  <a 
                    href={href}
                    className="font-heading text-xl text-secondary hover:text-accent block transition-colors duration-300"
                    onClick={() => setIsOpen(false)}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
};

export default HeaderNav;

function HamburgerMenu(setIsOpen, isOpen) {
  return <button
    onClick={() => setIsOpen(!isOpen)}
    className="menu-button mb-1 bg-primary text-paper rounded-sm flex flex-col items-center justify-center space-y-1.5 w-12 h-12 shadow-paper"
    aria-label="Toggle menu"
  >
    <span className={`block w-6 h-0.5 bg-paper transition-transform duration-300 ${isOpen ? 'translate-y-2 rotate-45' : ''}`}></span>
    <span className={`block w-6 h-0.5 bg-paper transition-opacity duration-300 ${isOpen ? 'opacity-0' : 'opacity-100'}`}></span>
    <span className={`block w-6 h-0.5 bg-paper transition-transform duration-300 ${isOpen ? '-translate-y-2 -rotate-45' : ''}`}></span>
  </button>;
}
