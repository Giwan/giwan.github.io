import { useEffect, useRef } from "react";
import ArticleHeader from "./ArticleHeader";
import { article } from "./article.module.css";

const Article = ({ children, meta }) => {

    const myArticle = useRef();
    
    const handleUseEffect = () => {
        if (!myArticle) return; 

        myArticle.current.parentElement.scrollTo(0,0);
    }
    
    useEffect(handleUseEffect, []); 
    return (
        <article className={article} ref={myArticle}>
            <ArticleHeader meta={meta} isBlogPost />
            {children}
        </article>
    );
}

export default Article;
