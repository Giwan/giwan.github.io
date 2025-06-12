import ArticleHeader from "../Article/ArticleHeader";

const ArticleItem = ({
    post: {
        link,
        module: { meta },
    },
}) => (
    <article className="mb-6">
        <a href={`/blog/${link}`} prefetch={false} className="block hover:no-underline">
            <ArticleHeader meta={meta} />
        </a>
    </article>
);

export default ArticleItem;
