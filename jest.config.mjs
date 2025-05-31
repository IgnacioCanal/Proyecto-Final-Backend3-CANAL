const config = {
  testEnvironment: 'node',
  transform: {},
  moduleFileExtensions: ['js', 'json', 'node'],
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)'
  ],
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
};

export default config;
