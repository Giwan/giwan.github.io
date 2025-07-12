const stripeBaseStyle = "block w-6 h-0.5 bg-background transition-all duration-300";

const HamburgerButton = ({ isOpen, onClick }) => (
  <button
    onClick={onClick}
    className={`menu-button mb-1 bg-primary text-background rounded-sm 
      flex flex-col items-center justify-center space-y-1.5 w-12 h-12 
      focus:outline-none focus:ring-2 focus:ring-syntax-purple 
      transition-all duration-200`}
    aria-label="Toggle menu"
  >
    <span className={`${stripeBaseStyle} ${isOpen ? 'translate-y-2 rotate-45' : ''}`} />
    <span className={`${stripeBaseStyle} ${isOpen ? 'opacity-0' : 'opacity-100'}`} />
    <span className={`${stripeBaseStyle} ${isOpen ? '-translate-y-2 -rotate-45' : ''}`} />
  </button>
);

export default HamburgerButton;