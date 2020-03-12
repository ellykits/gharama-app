import 'react-native';
global.fetch = require('jest-fetch-mock');
jest.mock('./__mocks__/react-native.ts');
