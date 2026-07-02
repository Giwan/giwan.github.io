import type { Article } from '../../types/article';

export interface ArticleRepository {
  fetchArticles(page: number, limit: number): Promise<Article[]>;
  getTotalCount(): number;
  getAllArticles(): Article[];
}
