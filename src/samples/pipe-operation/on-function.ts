import { Token, AST } from '../../types';
import { Var, Arithmetic, NumberLiteral } from '../helper';
import { DataType as DT } from '../../parser/utils';

const tokens: Array<Token> = [
  { type: 'keyword', value: 'def' },
  { type: 'ident', value: 'add' },
  { type: 'lparen', value: '(' },
  { type: 'ident', value: 'x' },
  { type: 'colon', value: ':' },
  { type: 'builtin-type', value: 'Num' },
  { type: 'comma', value: ',' },
  { type: 'ident', value: 'y' },
  { type: 'colon', value: ':' },
  { type: 'builtin-type', value: 'Num' },
  { type: 'rparen', value: ')' },
  { type: 'colon', value: ':' },
  { type: 'builtin-type', value: 'Num' },
  { type: 'arrow', value: '=>' },
  { type: 'ident', value: 'x' },
  { type: 'plus', value: '+' },
  { type: 'ident', value: 'y' },
  { type: 'newline', value: '\n' },

  { type: 'keyword', value: 'def' },
  { type: 'ident', value: 'subtract' },
  { type: 'lparen', value: '(' },
  { type: 'ident', value: 'x' },
  { type: 'colon', value: ':' },
  { type: 'builtin-type', value: 'Num' },
  { type: 'comma', value: ',' },
  { type: 'ident', value: 'y' },
  { type: 'colon', value: ':' },
  { type: 'builtin-type', value: 'Num' },
  { type: 'rparen', value: ')' },
  { type: 'colon', value: ':' },
  { type: 'builtin-type', value: 'Num' },
  { type: 'arrow', value: '=>' },
  { type: 'ident', value: 'x' },
  { type: 'dash', value: '-' },
  { type: 'ident', value: 'y' },
  { type: 'newline', value: '\n' },
  { type: 'newline', value: '\n' },

  { type: 'ident', value: 'result' },
  { type: 'eq', value: '=' },
  { type: 'number', value: '123' },
  { type: 'pipe-op', value: '|>' },
  { type: 'ident', value: 'add' },
  { type: 'lparen', value: '(' },
  { type: 'number', value: '321' },
  { type: 'rparen', value: ')' },
  { type: 'pipe-op', value: '|>' },
  { type: 'ident', value: 'subtract' },
  { type: 'lparen', value: '(' },
  { type: 'number', value: '666' },
  { type: 'rparen', value: ')' },
  { type: 'newline', value: '\n' },
];

const ast: AST = [
  {
    type: 'FunctionDeclaration',
    name: 'add',
    return: DT.Void,
    arguments: [
      { type: DT.Num, ident: 'x' },
      { type: DT.Num, ident: 'y' },
    ],
    body: [
      Arithmetic('x', '+', 'y'),
    ],
    outputType: DT.Num,
  },
  {
    type: 'FunctionDeclaration',
    name: 'subtract',
    return: DT.Void,
    arguments: [
      { type: DT.Num, ident: 'x' },
      { type: DT.Num, ident: 'y' },
    ],
    body: [
      Arithmetic('x', '-', 'y'),
    ],
    outputType: DT.Num,
  },
  {
    type: 'AssignmentExpr',
    return: DT.Void,
    expr1: Var('result', DT.Num),
    expr2: {
      type: 'FunctionInvokeExpr',
      name: 'subtract',
      return: DT.Num,
      params: [
        {
          type: 'FunctionInvokeExpr',
          name: 'add',
          return: DT.Num,
          params: [
            NumberLiteral(123),
            NumberLiteral(321),
          ],
        },
        NumberLiteral(666), 
      ],
    },
  },
];

const compiled = `\
function add(x, y) {
  return x + y;
}

function subtract(x, y) {
  return x - y;
}

const result = subtract(add(123, 321), 666);
`;

const minified = 'function add(x,y){return x+y;}function subtract(x,y){return x-y;}const result=subtract(add(123,321),666);';

export {
  tokens,
  ast,
  compiled,
  minified,
};
