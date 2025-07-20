export interface Article {
  url: string;
  title: string;
  description: string;
  formattedDate: string;
}

export interface ArticleStoreState {
  articles: Article[];
  page: number;
  hasMore: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface ArticleData {
  allArticles: Article[];
  totalArticles: number;
  initialCount: number;
  loadedCount: number;
  hasMore: boolean;
}

export interface ArticlesListWrapperProps {
  initialArticles: Article[];
  hasMore: boolean;
  totalArticles: number;
  allArticles: Article[];
}

// Extend the Window interface to include __ARTICLE_DATA__
declare global {
  interface Window {
    __ARTICLE_DATA__?: ArticleData;
  }
}