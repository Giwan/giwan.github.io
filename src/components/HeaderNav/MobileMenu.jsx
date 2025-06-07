import headerNavData from "./headerLinks.json";

const MobileMenu = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="mobile-menu-container fixed inset-0 z-50 bg-paper">
      <div className="p-4 bg-primary text-paper flex justify-between items-center">
        <h2 className="font-heading text-2xl">Menu</h2>
        <button 
          onClick={onClose}
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
                onClick={onClose}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default MobileMenu;