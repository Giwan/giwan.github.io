import React from 'react';
import { useStore } from '@nanostores/react';
import { $articleStore } from '../stores/articleStore';
import { loadMoreArticles, retryLoadingArticles } from '../services/articleService';
import { LoadingSpinner } from './LoadingSpinner';
import type { JSX } from 'astro/jsx-runtime';

/**
 * Component for the "load more" button
 * Displays loading state and error handling UI
 */
export function ArticlesLoadMore(): JSX.Element | null {
  const { isLoading, error, hasMore, articles } = useStore($articleStore);
  
  // Don't show anything if there are no articles, no more articles, and no error
  if (!hasMore && !error && articles.length === 0) return null;
  
  return (
    <div className="text-center mt-8" aria-live="polite">
      {error && (
        <div className="text-red-500 mb-4 p-2 bg-red-50 border border-red-200 rounded-md inline-block">
          <p className="mb-2">{error}</p>
          <button 
            onClick={() => retryLoadingArticles()} 
            className="underline font-medium hover:text-red-700"
            aria-label="Try loading articles again"
          >
            Try again
          </button>
        </div>
      )}
      
      {hasMore && (
        <button 
          onClick={() => loadMoreArticles()} 
          disabled={isLoading}
          className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2 rounded-lg disabled:opacity-70 flex items-center justify-center gap-2 mx-auto"
          aria-label="Load more articles"
        >
          {isLoading ? (
            <LoadingSpinner size="small" color="secondary" />
          ) : (
            'Load More Articles'
          )}
        </button>
      )}
      
      {!hasMore && articles.length > 0 && !error && (
        <p className="text-muted-foreground mt-4">
          You've reached the end of the articles.
        </p>
      )}
    </div>
  );
}