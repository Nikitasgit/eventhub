/** @type {import('jest').Config} */
module.exports = {
  // Utilise ts-jest pour compiler TS/TSX
  preset: 'ts-jest',
  testEnvironment: 'jsdom',

  // Où chercher les tests
  testMatch: ['**/?(*.)+(test).[tj]s?(x)'],

  // Dossier racine
  rootDir: '.',

  coverageDirectory: '<rootDir>/coverage',
  coverageProvider: 'v8',

  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],

  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },

  // Comment transformer TS/TSX
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },

  // Fichier exécuté avant chaque test
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
};
