import headerNavData from "./headerLinks.json";

const MobileMenu = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="mobile-menu-container fixed inset-0 z-50 bg-background border-r border-border">
      <div className="p-4 bg-muted text-foreground flex justify-between items-center border-b border-border">
        <h2 className="font-heading text-2xl text-primary">Menu</h2>
        <button 
          onClick={onClose}
          className="text-3xl p-2 text-muted-foreground hover:text-destructive focus:text-destructive transition-colors duration-200 hover:bg-muted focus:bg-muted rounded focus:outline-none focus:ring-2 focus:ring-ring"
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
                className="font-heading text-xl text-muted-foreground hover:text-primary focus:text-primary block transition-all duration-300 py-2 px-3 rounded hover:bg-muted focus:bg-muted border-l-4 border-transparent hover:border-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
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