import ArticleHeader from "../Article/ArticleHeader";
import styles from "./articleItem.module.css";

const ArticleItem = ({
    post: {
        link,
        module: { meta },
    },
}) => (
    <article className={styles.articleItem}>
        <a href={`/blog/${link}`} prefetch={false}>
            <a alt={meta.title} className={styles.articleItemLink}>
                <ArticleHeader meta={meta} />
            </a>
        </a>
    </article>
);

export default ArticleItem;
