module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/test/app.e2e-spec.ts'],
  transform: {
    '^.+\\.(t|j)s$': ['ts-jest', { tsconfig: 'tsconfig.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'json'],
  rootDir: '.',
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/livrable-tp2-e2e/',
  ],
  modulePathIgnorePatterns: ['livrable-tp2-e2e'],
};
