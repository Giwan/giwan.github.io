// Mock for nanostores that holds state
function createMockMap(initialState) {
  let state = { ...initialState };
  const listeners = new Set();

  return {
    get: jest.fn(() => state),
    set: jest.fn((newState) => {
      state = newState;
      listeners.forEach(listener => listener(state));
    }),
    setKey: jest.fn((key, value) => {
      state[key] = value;
      listeners.forEach(listener => listener(state));
    }),
    subscribe: jest.fn((listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    }),
    // Helper for tests to reset state
    _reset: () => {
      state = { ...initialState };
    }
  };
}

// Store created stores to persist them across imports
const stores = {};

const map = jest.fn((initialState) => {
  // Use a key to identify the store, e.g., based on initial keys
  const key = Object.keys(initialState).join(',');
  if (!stores[key]) {
    stores[key] = createMockMap(initialState);
  }
  return stores[key];
});

const atom = jest.fn((initialValue) => {
    let value = initialValue;
    const listeners = new Set();

    return {
        get: jest.fn(() => value),
        set: jest.fn((newValue) => {
            value = newValue;
            listeners.forEach(listener => listener(value));
        }),
        subscribe: jest.fn((listener) => {
            listeners.add(listener);
            return () => listeners.delete(listener);
        })
    };
});


module.exports = {
  map,
  atom
};