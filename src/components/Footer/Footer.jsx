import styles from "./footer.module.css";

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
    <footer className={styles.footer}>
        <ul>
            {footerData.map((fd) => (
                <li key={fd.label}>
                    <a href={fd.url} alt={fd.alt}>
                        {fd.label}
                    </a>
                </li>
            ))}
        </ul>
        <div className={styles.copyright}>
            &copy; Amsterdam, {new Date().getUTCFullYear()} - Mytoori.com
        </div>
    </footer>
);

export default Footer;
