import { useEffect, useRef } from "react";
import ArticleHeader from "./ArticleHeader";

const Article = ({ children, meta }) => {

    const myArticle = useRef();
    
    const handleUseEffect = () => {
        if (!myArticle) return; 

        myArticle.current.parentElement.scrollTo(0,0);
    }
    
    useEffect(handleUseEffect, []); 
    return (
        <article className="max-w-4xl mx-auto px-4 py-8 prose prose-lg prose-invert" ref={myArticle}>
            <ArticleHeader meta={meta} isBlogPost />
            <div className="mt-8">
                {children}
            </div>
        </article>
    );
}

export default Article;
