import headerNavData from "./headerLinks.json";

const MobileMenu = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="mobile-menu-container fixed inset-0 z-50 bg-background border-r border-border-light shadow-2xl">
      <div className="p-4 bg-background-highlight text-text-primary flex justify-between items-center border-b border-border">
        <h2 className="font-heading text-2xl text-primary">Menu</h2>
        <button 
          onClick={onClose}
          className="text-3xl p-2 text-text-secondary hover:text-syntax-red transition-colors duration-200 hover:bg-background-light rounded"
          aria-label="Close menu"
        >
          &times;
        </button>
      </div>
      
      <nav className="p-6">
        <ul className="space-y-6">
          {headerNavData.map(({ label, href }) => (
            <li key={href} className="border-b border-border pb-4 last:border-b-0">
              <a 
                href={href}
                className="font-heading text-xl text-text-secondary hover:text-accent block transition-all duration-300 py-2 px-3 rounded hover:bg-background-light border-l-4 border-transparent hover:border-syntax-purple"
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