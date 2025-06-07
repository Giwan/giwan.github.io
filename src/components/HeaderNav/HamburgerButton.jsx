const HamburgerButton = ({ isOpen, onClick }) => (
  <button
    onClick={onClick}
    className="menu-button mb-1 bg-primary text-background rounded-sm flex flex-col items-center justify-center space-y-1.5 w-12 h-12 shadow-lg hover:bg-accent focus:bg-accent focus:outline-none focus:ring-2 focus:ring-syntax-purple transition-all duration-200 hover:shadow-xl"
    aria-label="Toggle menu"
  >
    <span className={`block w-6 h-0.5 bg-background transition-all duration-300 ${isOpen ? 'translate-y-2 rotate-45' : ''}`} />
    <span className={`block w-6 h-0.5 bg-background transition-all duration-300 ${isOpen ? 'opacity-0' : 'opacity-100'}`} />
    <span className={`block w-6 h-0.5 bg-background transition-all duration-300 ${isOpen ? '-translate-y-2 -rotate-45' : ''}`} />
  </button>
);

export default HamburgerButton;