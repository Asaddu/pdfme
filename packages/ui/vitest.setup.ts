import 'vitest-canvas-mock';
import '@testing-library/jest-dom/vitest';
import { TextEncoder, TextDecoder } from 'util';

Object.assign(global, { TextDecoder, TextEncoder });

if (typeof globalThis.structuredClone !== 'function') {
  globalThis.structuredClone = (obj: unknown) => JSON.parse(JSON.stringify(obj));
}
