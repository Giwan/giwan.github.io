const HamburgerButton = ({ isOpen, onClick }) => (
  <button
    onClick={onClick}
    className="menu-button mb-1 bg-primary text-paper rounded-sm flex flex-col items-center justify-center space-y-1.5 w-12 h-12 shadow-paper hover:bg-highlight focus:bg-highlight focus:outline-none focus:ring-2 focus:ring-accent transition-colors duration-200"
    aria-label="Toggle menu"
  >
    <span className={`block w-6 h-0.5 bg-paper transition-all duration-300 ${isOpen ? 'translate-y-2 rotate-45' : ''}`} />
    <span className={`block w-6 h-0.5 bg-paper transition-all duration-300 ${isOpen ? 'opacity-0' : 'opacity-100'}`} />
    <span className={`block w-6 h-0.5 bg-paper transition-all duration-300 ${isOpen ? '-translate-y-2 -rotate-45' : ''}`} />
  </button>
);

export default HamburgerButton;