import "@testing-library/jest-dom";

// Polyfills pour les APIs Web manquantes dans jsdom
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { TextEncoder, TextDecoder } = require("util");
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Polyfill pour crypto.randomUUID() dans jsdom
if (!global.crypto || !global.crypto.randomUUID) {
  let counter = 0;
  global.crypto = {
    ...global.crypto,
    randomUUID: () => {
      counter++;
      return `test-uuid-${counter}`;
    },
  } as Crypto;
}
