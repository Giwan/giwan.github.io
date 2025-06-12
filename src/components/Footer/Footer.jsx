const footerData = [
    {
        label: "About",
        url: "/about",
        alt: "Mytoori blog about page",
    },
    {
        label: "Mytoori",
        url: "https://mytoori.com",
        alt: "Mytoori main application",
    },
    {
        label: "What is",
        url: "/whatis/",
        alt: "Explanations of basic concepts and tools"
    }
];

const Footer = () => (
    <footer className="bg-muted border-t border-border mt-16 py-8 px-6">
        <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center">
                <nav className="mb-4 md:mb-0">
                    <ul className="flex space-x-6">
                        {footerData.map((fd) => (
                            <li key={fd.label}>
                                <a 
                                    href={fd.url} 
                                    alt={fd.alt}
                                    className="text-muted-foreground hover:text-accent transition-colors duration-200 font-medium"
                                >
                                    {fd.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>
                <div className="text-muted-foreground text-sm">
                    &copy; Amsterdam, {new Date().getUTCFullYear()} - Mytoori.com
                </div>
            </div>
        </div>
    </footer>
);

export default Footer;
