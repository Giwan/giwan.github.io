import { useState } from "react";
import ListItem from "./ListItem";
import styles from "./headernav.module.css";
import headerNavData from "./headerLinks.json";
import HeaderLogo from "../Header/HeaderLogo";

const HeaderNavOptions = ({ isOpen, close }) => {
    if (!isOpen) return null;

    return (
        <div className={styles.menuContainer}>
            <div className={styles.headerNavMeta}>
                <HeaderLogo />
                <button className={styles.closeButton} onClick={close}>
                    +
                </button>
            </div>
            <ul className={styles.headerNavList}>
                {headerNavData.map(({ label: name, href: target }) => (
                    <ListItem {...{ key: name, name, target }} />
                ))}
            </ul>
        </div>
    );
};

const HeaderNav = () => {
    const [isOpen, setIsOpen] = useState(false);
    const handleClick = () => setIsOpen((v) => !v);
    const close = () => setIsOpen(false);

    return (
        <nav className={styles.headerNav}>
            <button className={styles.headerNavButton} onClick={handleClick}>
                |||
            </button>
            <HeaderNavOptions {...{ isOpen, close }} />
        </nav>
    );
};

export default HeaderNav;
