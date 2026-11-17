export interface Article {
  url: string;
  title: string;
  description: string;
  formattedDate: string;
}

export interface ArticleData {
  allArticles: Article[];
  totalArticles: number;
  initialCount: number;
  loadedCount: number;
  hasMore: boolean;
}

// Extend the Window interface to include __ARTICLE_DATA__
declare global {
  interface Window {
    __ARTICLE_DATA__?: ArticleData;
  }
}
