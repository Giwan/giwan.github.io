import React from 'react';
import { useStore } from '@nanostores/react';
import { $articleStore } from '../stores/articleStore';
import { LoadingSpinner } from './LoadingSpinner';
import { UI_TEXT } from '@/constants/uiTexts';
import type { Article } from '../types/article';
import type { JSX } from 'astro/jsx-runtime';

/**
 * Component for rendering articles from the store
 * Only renders articles beyond the initial server-rendered set
 */
export function ArticlesList(): JSX.Element | null {
  const { articles, isLoading } = useStore($articleStore);

  // Skip the a`rticles that are already server-rendered
  // Only render articles loaded client-side
  const initialArticleCount = window.__ARTICLE_DATA__?.initialCount || 10;
  const clientSideArticles = articles.slice(initialArticleCount);

  if (clientSideArticles.length === 0 && !isLoading) return null;

  return (
    <ul className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-8 w-full">
      {clientSideArticles.map((article: Article, index: number) => (
        <li 
          key={article.url} 
          className="border border-border p-4 rounded-lg bg-card md:h-[420px] overflow-hidden transition-colors hover:bg-muted/50 group article-item"
          style={{ 
            viewTransitionName: `article-${article.url.replace(/\//g, '-')}`,
            animationDelay: `${(initialArticleCount + index) * 50}ms`
          }}
        >
          <a href={article.url} className="block h-full">
            <h2 className="text-4xl md:text-5xl mb-1 font-heading font-extrabold text-primary group-hover:underline">{article.title}</h2>
            <p className="text-muted-foreground mb-4 font-heading text-sm">{article.formattedDate}</p>
            <p className="text-foreground leading-7 text-lg">
              {article.description}
            </p>
          </a>
        </li>
      ))}

      {isLoading && (
        <li className="col-span-full text-center p-4" aria-live="polite">
          <div className="flex flex-col items-center justify-center gap-2">
            <LoadingSpinner size="large" />
            <p>{UI_TEXT.loadingMoreArticles}</p>
          </div>
        </li>
      )}
    </ul>
  );
}