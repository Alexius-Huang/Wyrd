import { DirectMethodMap } from '../types';

export const StrMethodsDirectMap: DirectMethodMap = new Map([
  ['upcase', { name: 'toUpperCase', argCount: 0 }],
  ['repeat', { name: 'repeat', argCount: 1 }],
]);
