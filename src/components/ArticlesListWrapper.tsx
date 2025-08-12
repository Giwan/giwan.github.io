import React, { useEffect } from 'react';
import { useStore } from "@nanostores/react";
import { $isMobileMenuOpen } from "../stores/mobileMenuStore";
import { setArticles, setHasMore } from '../stores/articleStore';
import { ArticlesList } from './ArticlesList';
import { ArticlesLoadMore } from './ArticlesLoadMore';
import type { ArticlesListWrapperProps, ArticleData, Article } from '../types/article';
import { STORAGE_KEYS, TIME_CONSTANTS } from '../constants/storage';

/**
 * Wrapper component for articles list
 * Hydrates the store with server-rendered articles
 * Handles mobile menu state
 */
const ArticlesListWrapper: React.FC<ArticlesListWrapperProps> = ({ 
  initialArticles, 
  hasMore, 
  totalArticles, 
  allArticles 
}) => {
  const isMobileMenuOpen = useStore($isMobileMenuOpen);
  
  useEffect(() => {
    // Check if we have stored article data from a previous visit
    const storedState = sessionStorage.getItem(STORAGE_KEYS.ARTICLE_STATE);
    let storedArticleData: ArticleData | null = null;
    
    if (storedState) {
      try {
        const articleState = JSON.parse(storedState);
        storedArticleData = articleState.articleData as ArticleData;
        
        // Only use stored data if it's less than 5 minutes old
        if (Date.now() - articleState.timestamp > TIME_CONSTANTS.FIVE_MINUTES_MS) {
          storedArticleData = null;
        }
      } catch (error) {
        console.error('Error parsing stored article state:', error);
      }
    }
    
    if (storedArticleData) {
      // Use the stored article data
      window.__ARTICLE_DATA__ = storedArticleData;
      
      // Hydrate the store with all articles from storage
      const loadedCount = storedArticleData.loadedCount || 0;
      setArticles(storedArticleData.allArticles.slice(0, storedArticleData.initialCount + loadedCount));
      setHasMore(storedArticleData.hasMore);
    } else {
      // Hydrate the store with server-rendered articles
      setArticles(initialArticles);
      setHasMore(hasMore);
      
      // Store the full article list for client-side pagination
      // This avoids re-fetching from the server
      window.__ARTICLE_DATA__ = {
        allArticles,
        totalArticles,
        initialCount: initialArticles.length,
        loadedCount: 0,
        hasMore
      };
    }
    
    // Clean up when component unmounts
    return () => {
      // We don't reset the store here because we want to preserve the state
      // for when the user navigates back to this page
    };
  }, [initialArticles, hasMore, totalArticles, allArticles]);
  
  // Don't render the "load more" UI when mobile menu is open
  if (isMobileMenuOpen) {
    return null;
  }
  
  // Only render the client-side components
  // The initial articles are already rendered by Astro
  return (
    <div className="articles-client-components" data-transition-context="load-more">
      <ArticlesList />
      <ArticlesLoadMore />
    </div>
  );
};

export default ArticlesListWrapper;