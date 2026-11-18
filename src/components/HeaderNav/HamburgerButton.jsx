const stripeBaseStyle = "block w-5 h-0.5 bg-current transition-all duration-300";

const HamburgerButton = ({ isOpen, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="menu-button flex h-11 w-11 flex-col items-center justify-center space-y-1.5 rounded-none border border-border bg-background text-primary transition-colors duration-200 hover:border-editorial hover:text-editorial focus-editorial"
    aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
    aria-expanded={isOpen}
    aria-controls="mobile-navigation"
  >
    <span className={`${stripeBaseStyle} ${isOpen ? 'translate-y-2 rotate-45' : ''}`} />
    <span className={`${stripeBaseStyle} ${isOpen ? 'opacity-0' : 'opacity-100'}`} />
    <span className={`${stripeBaseStyle} ${isOpen ? '-translate-y-2 -rotate-45' : ''}`} />
  </button>
);

export default HamburgerButton;
