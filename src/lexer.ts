import { Token } from "./types";

const NumberRegex = /[0-9]/;
// const WhitespaceRegex = /\s/;
const tokenMaps = new Map<string, Token>([
  ['+', { type: 'plus', value: '+' }],
  ['-', { type: 'dash', value: '-' }],
  ['*', { type: 'asterisk', value: '*' }],
  ['/', { type: 'slash', value: '/' }],
  ['%', { type: 'percent', value: '%' }],
  ['\\', { type: 'bslash', value: '\\' }],
  ['(', { type: 'lparen', value: '(' }],
  [')', { type: 'rparen', value: ')' }],
  ['[', { type: 'lbracket', value: '[' }],
  [']', { type: 'rbracket', value: ']' }],
  ['{', { type: 'lcurly', value: '{' }],
  ['}', { type: 'rcurly', value: '}' }],
  ['=', { type: 'eq', value: '=' }],
  ['&', { type: 'amp', value: '&' }],
  ['|', { type: 'pipe', value: '|' }],
  ['?', { type: 'question', value: '?' }],
  ['!', { type: 'bang', value: '!' }],
  ['#', { type: 'sharp', value: '#' }],
  ['$', { type: 'dollar', value: '$' }],
  ['@', { type: 'at', value: '@' }],
  ['~', { type: 'wavy', value: '~' }],
  [':', { type: 'colon', value: ':' }],
  [';', { type: 'semicolon', value: ';' }],
  ['>', { type: 'gt', value: '>' }],
  ['<', { type: 'lt', value: '<' }],
  ['^', { type: 'caret', value: '^' }],
  ['.', { type: 'dot', value: '.' }],
  [',', { type: 'comma', value: ',' }],
  ['_', { type: 'underscore', value: '_' }],
  ['\n',  { type: 'newline', value: '\n' }],
]);

export function lex(code: string): Array<Token> {
  const result: Array<Token> = [];

  let index = 0;

  while (index < code.length) {
    let currentChar = code[index];

    if (tokenMaps.has(currentChar)) {
      result.push(tokenMaps.get(currentChar) as Token);
      index++;
      continue;
    }

    if (NumberRegex.test(currentChar)) {
      let parsedNumber = '';

      do {
        parsedNumber += currentChar;
        currentChar = code[++index];
      } while (NumberRegex.test(currentChar) && index < code.length)

      result.push({ type: 'number', value: parsedNumber });
      continue;
    }

    index++;
  }

  return result;
}
