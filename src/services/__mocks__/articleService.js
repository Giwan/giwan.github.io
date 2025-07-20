// Mock for articleService.js
const loadInitialArticles = jest.fn();
const loadMoreArticles = jest.fn();
const retryLoadingArticles = jest.fn();

module.exports = {
  loadInitialArticles,
  loadMoreArticles,
  retryLoadingArticles
};