export default {
  coverageProvider: 'v8',
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/__mocks__/fileMock.js',
    '@nanostores/react': '<rootDir>/src/__mocks__/nanostores-react.js',
    'nanostores': '<rootDir>/src/__mocks__/nanostores.js',
    '^@/(.*)$': '<rootDir>/src/$1',
    '^(\\.{1,2}/.*)\\.js$': '$1'
  },
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    url: 'http://localhost/'
  },
  transform: {
    '^.+\\.[t|j]sx?$': ['ts-jest', {
      useESM: true,
    }],
  },
  transformIgnorePatterns: [
    'node_modules/(?!(@nanostores|nanostores)/)'
  ],
};
