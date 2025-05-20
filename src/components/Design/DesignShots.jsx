import { designPages } from "../../data/designPagesData";
import styles from "./designShots.module.css";
const cloudinaryPrefix = "https://res.cloudinary.com/mytoori/image/upload";

const DesignShots = () => (
    <section className={styles.designPage}>
        {designPages.map((page) => (
            <div key={page.url}>
                <a
                    href={page.url}
                    target="_blank"
                    rel="norel noreferrer"
                    alt={page.description}
                >
                    <img
                        className={styles.designImage}
                        alt={`${page.url} landing page - ${page.description}`}
                        src={`${cloudinaryPrefix}${page.imgName}`}
                    />
                </a>
            </div>
        ))}
    </section>
);

export default DesignShots;
