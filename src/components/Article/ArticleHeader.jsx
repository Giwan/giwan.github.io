/**
 * Tis header post is being used in two places
 * The post item on the listing page.
 * The detail page showing the blog article
 *
 * The description for example is not required
 * on the detail page
 */
import styles, { readButton } from "./articleHeader.module.css";

const dateOptions = {
    year: "numeric",
    month: "long",
    day: "2-digit",
};

const ArticleHeader = ({ meta, isBlogPost }) => {
    const dateOptionsFiltered = {
        ...dateOptions,
        weekday: isBlogPost ? "long" : undefined,
    };

    const articleDate = meta.published || meta.createdDate;

    return (
        <div className={styles.articleItem}>
            <ArticleTitle {...{ isBlogPost, meta }} />
            <div className={styles.articleHeaderMetaDetails}>
                <span>{meta.readTime + " minutes"}</span>
                <span>
                    {new Date(articleDate).toLocaleDateString(
                        "en-GB",
                        dateOptionsFiltered
                    )}
                </span>
                <OpenArrow {...{ isBlogPost }} />
            </div>
            <div className={styles.articleHeaderSummary}>
                {isBlogPost ? null : <p>{meta.description}</p>}
            </div>
        </div>
    );
};

export default ArticleHeader;

const DraftText = () => <span className={styles.draft}>DRAFT</span>

const isDraft = (published) => published ? "" : <DraftText />;

const ArticleTitle = ({ isBlogPost, meta: { title, published } }) => (
        <header className={styles.articleHeader} data-draft={!published}>
            {isBlogPost ? (
                <h1 className={styles.articleHeaderh1}>{title}{isDraft(published)}</h1>
            ) : (
                <h2 className={styles.articleItemHeader}>{title}{isDraft(published)}</h2>
            )}
        </header>
    );

const OpenArrow = ({ isBlogPost }) => {
    if (isBlogPost) return null;

    return (
        <button className={readButton}>
            <svg
                width="8"
                height="12"
                viewBox="0 0 8 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M1.41 0L0 1.41L4.58 6L0 10.59L1.41 12L7.41 6L1.41 0Z"
                    fill="#828282"
                />
            </svg>
        </button>
    );
};
