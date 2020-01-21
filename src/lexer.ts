import { Token } from "./types";

const NumberRegex = /[0-9]/;
const LetterRegex = /[a-zA-Z]/;
const NamingRegex = /[a-zA-Z0-9]/;
const WhitespaceRegex = /\s/i;
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

function LexerError(msg: string): never {
  throw new Error(`Lexer Error: ${msg}`);
}

export function lex(code: string): Array<Token> {
  const result: Array<Token> = [];

  let index = 0;
  let currentChar = code[index];

  function nextChar() {
    currentChar = code[++index];
  }

  while (index < code.length) {
    if (WhitespaceRegex.test(currentChar)) {
      if (currentChar === '\n')
        result.push({ type: 'newline', value: '\n' });
      nextChar();
      continue;
    }

    if (tokenMaps.has(currentChar)) {
      result.push(tokenMaps.get(currentChar) as Token);
      nextChar();
      continue;
    }

    if (NumberRegex.test(currentChar)) {
      let parsedNumber = '';

      do {
        parsedNumber += currentChar;
        nextChar();
      } while (NumberRegex.test(currentChar) && index < code.length)

      result.push({ type: 'number', value: parsedNumber });
      continue;
    }

    if (LetterRegex.test(currentChar)) {
      let parsedName = '';

      do {
        parsedName += currentChar;
        nextChar();
      } while (NamingRegex.test(currentChar) && currentChar !== undefined)
    
      result.push({ type: 'ident', value: parsedName });
      continue;
    }

    LexerError(`Unhandled Character: \`${currentChar}\``);    
  }

  return result;
}
