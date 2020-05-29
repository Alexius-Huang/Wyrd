import { Token, AST } from '../../types';
import { NumberLiteral, Arithmetic } from '../helper';
import { DataType as DT } from '../../parser/utils';

const tokens: Array<Token> = [
  { type: 'keyword', value: 'def' },
  { type: 'ident', value: 'foo' },
  { type: 'lparen', value: '(' },
  { type: 'ident', value: 'x' },
  { type: 'colon', value: ':' },
  { type: 'builtin-type', value: 'Num' },
  { type: 'rparen', value: ')' },
  { type: 'colon', value: ':' },
  { type: 'builtin-type', value: 'Num' },
  { type: 'keyword', value: 'do' },
  { type: 'newline', value: '\n' },
  { type: 'ident', value: 'x' },
  { type: 'asterisk', value: '*' },
  { type: 'number', value: '2' },
  { type: 'newline', value: '\n' },
  { type: 'keyword', value: 'end' },
  { type: 'newline', value: '\n' },
  { type: 'newline', value: '\n' },

  { type: 'keyword', value: 'def' },
  { type: 'ident', value: 'bar' },
  { type: 'lparen', value: '(' },
  { type: 'ident', value: 'x' },
  { type: 'colon', value: ':' },
  { type: 'builtin-type', value: 'Num' },
  { type: 'rparen', value: ')' },
  { type: 'colon', value: ':' },
  { type: 'builtin-type', value: 'Num' },
  { type: 'keyword', value: 'do' },
  { type: 'newline', value: '\n' },
  { type: 'ident', value: 'foo' },
  { type: 'lparen', value: '(' },
  { type: 'ident', value: 'x' },
  { type: 'plus', value: '+' },
  { type: 'number', value: '2' },
  { type: 'rparen', value: ')' },
  { type: 'newline', value: '\n' },
  { type: 'keyword', value: 'end' },
  { type: 'newline', value: '\n' },
  { type: 'newline', value: '\n' },

  { type: 'keyword', value: 'def' },
  { type: 'ident', value: 'baz' },
  { type: 'lparen', value: '(' },
  { type: 'ident', value: 'x' },
  { type: 'colon', value: ':' },
  { type: 'builtin-type', value: 'Num' },
  { type: 'rparen', value: ')' },
  { type: 'colon', value: ':' },
  { type: 'builtin-type', value: 'Num' },
  { type: 'keyword', value: 'do' },
  { type: 'newline', value: '\n' },
  { type: 'ident', value: 'bar' },
  { type: 'lparen', value: '(' },
  { type: 'ident', value: 'x' },
  { type: 'slash', value: '/' },
  { type: 'number', value: '2' },
  { type: 'rparen', value: ')' },
  { type: 'newline', value: '\n' },
  { type: 'keyword', value: 'end' },
  { type: 'newline', value: '\n' },
  { type: 'newline', value: '\n' },

  { type: 'ident', value: 'baz' },
  { type: 'lparen', value: '(' },
  { type: 'number', value: '123' },
  { type: 'rparen', value: ')' },
  { type: 'newline', value: '\n' }
];

const ast: AST = [
  {
    type: 'FunctionDeclaration',
    return: DT.Void,
    name: 'foo',
    arguments: [
      { ident: 'x', type: DT.Num }
    ],
    outputType: DT.Num,
    body: [
      Arithmetic('x', '*', 2),
    ],
  },
  {
    type: 'FunctionDeclaration',
    return: DT.Void,
    name: 'bar',
    arguments: [
      { ident: 'x', type: DT.Num }
    ],
    outputType: DT.Num,
    body: [
      {
        type: 'FunctionInvokeExpr',
        return: DT.Num,
        name: 'foo',
        params: [
          Arithmetic('x', '+', 2),
        ],
      },
    ],
  },
  {
    type: 'FunctionDeclaration',
    return: DT.Void,
    name: 'baz',
    arguments: [
      { ident: 'x', type: DT.Num }
    ],
    outputType: DT.Num,
    body: [
      {
        type: 'FunctionInvokeExpr',
        return: DT.Num,
        name: 'bar',
        params: [
          Arithmetic('x', '/', 2),
        ],
      },
    ],
  },
  {
    type: 'FunctionInvokeExpr',
    return: DT.Num,
    name: 'baz',
    params: [
      NumberLiteral(123),
    ],
  },
];

const compiled = `\
function foo(x) {
  return x * 2;
}

function bar(x) {
  return foo(x + 2);
}

function baz(x) {
  return bar(x / 2);
}

baz(123);
`;

const minified = 'function foo(x){return x*2;}function bar(x){return foo(x+2);}function baz(x){return bar(x/2);}baz(123);';

export {
  tokens,
  ast,
  compiled,
  minified,
};
