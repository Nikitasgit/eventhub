module.exports = {
  collectCoverage: false,
  preset: "ts-jest",
  testEnvironment: "node",
  maxWorkers: 1,
  testPathIgnorePatterns: ["/node_modules/", "/src/tests/integration/"],
  testRegex: "\\.test\\.ts$",
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  moduleFileExtensions: ["js", "json", "ts", "tsx"],
  rootDir: ".",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
};
