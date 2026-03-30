// Mock for articleStore.js
const defaultState = {
    articles: [],
    page: 1,
    hasMore: true,
    isLoading: false,
    error: null,
};

const mockState = {
    ...defaultState,
};

export const $articleStore = {
    get: jest.fn(() => mockState),
    set: jest.fn((newState) => {
        Object.assign(mockState, newState);
    }),
    setKey: jest.fn((key, value) => {
        mockState[key] = value;
    }),
    subscribe: jest.fn(),
};

export const resetStore = jest.fn(() => {
    mockState.articles = [];
    mockState.page = 1;
    mockState.hasMore = true;
    mockState.isLoading = false;
    mockState.error = null;
});

export const setArticles = jest.fn((articles) => {
    mockState.articles = articles;
});

export const appendArticles = jest.fn((newArticles) => {
    mockState.articles = [...mockState.articles, ...newArticles];
});

export const setPage = jest.fn((page) => {
    mockState.page = page;
});

export const setHasMore = jest.fn((hasMore) => {
    mockState.hasMore = hasMore;
});

export const setLoading = jest.fn((isLoading) => {
    mockState.isLoading = isLoading;
});

export const setError = jest.fn((error) => {
    mockState.error = error;
});

// Reset function to be called in beforeEach hooks
export function resetMockState() {
    Object.assign(mockState, defaultState);
    jest.clearAllMocks();
}
