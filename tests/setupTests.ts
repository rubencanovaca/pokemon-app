import '@testing-library/jest-dom';

// Polyfill for TextEncoder/TextDecoder in jsdom
import { TextEncoder, TextDecoder } from 'util';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as any;
