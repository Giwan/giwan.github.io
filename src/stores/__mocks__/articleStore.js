// Mock for articleStore.js
const defaultState = {
  articles: [],
  page: 1,
  hasMore: true,
  isLoading: false,
  error: null
};

const mockState = { ...defaultState };

const $articleStore = {
  get: jest.fn(() => mockState),
  set: jest.fn((newState) => {
    Object.assign(mockState, newState);
  }),
  setKey: jest.fn((key, value) => {
    mockState[key] = value;
  }),
  subscribe: jest.fn()
};

const resetStore = jest.fn(() => {
  mockState.articles = [];
  mockState.page = 1;
  mockState.hasMore = true;
  mockState.isLoading = false;
  mockState.error = null;
});

const setArticles = jest.fn((articles) => {
  mockState.articles = articles;
});

const appendArticles = jest.fn((newArticles) => {
  mockState.articles = [...mockState.articles, ...newArticles];
});

const setPage = jest.fn((page) => {
  mockState.page = page;
});

const setHasMore = jest.fn((hasMore) => {
  mockState.hasMore = hasMore;
});

const setLoading = jest.fn((isLoading) => {
  mockState.isLoading = isLoading;
});

const setError = jest.fn((error) => {
  mockState.error = error;
});

// Reset function to be called in beforeEach hooks
function resetMockState() {
  Object.assign(mockState, defaultState);
  jest.clearAllMocks();
}

module.exports = {
  $articleStore,
  resetStore,
  setArticles,
  appendArticles,
  setPage,
  setHasMore,
  setLoading,
  setError,
  resetMockState
};