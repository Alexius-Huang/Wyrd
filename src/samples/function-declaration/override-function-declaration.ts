import { Token, AST, Operator as Op } from '../../types';
import { NumberLiteral, Arithmetic } from '../helper';
import { DataType as DT } from '../../parser/utils';

const tokens: Array<Token> = [
  { type: 'keyword', value: 'def' },
  { type: 'ident', value: 'addition' },
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

  { type: 'ident', value: 'addition' },
  { type: 'lparen', value: '(' },
  { type: 'number', value: '1' },
  { type: 'comma', value: ',' },
  { type: 'number', value: '2' },
  { type: 'rparen', value: ')' },
  { type: 'newline', value: '\n' },
  { type: 'newline', value: '\n' },

  { type: 'keyword', value: 'override' },
  { type: 'keyword', value: 'def' },
  { type: 'ident', value: 'addition' },
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
  { type: 'lparen', value: '(' },
  { type: 'ident', value: 'x' },
  { type: 'plus', value: '+' },
  { type: 'ident', value: 'y' },
  { type: 'rparen', value: ')' },
  { type: 'asterisk', value: '*' },
  { type: 'number', value: '2' },
  { type: 'newline', value: '\n' },

  { type: 'ident', value: 'addition' },
  { type: 'lparen', value: '(' },
  { type: 'number', value: '1' },
  { type: 'comma', value: ',' },
  { type: 'number', value: '2' },
  { type: 'rparen', value: ')' },
  { type: 'newline', value: '\n' },
  { type: 'newline', value: '\n' },

  { type: 'keyword', value: 'override' },
  { type: 'keyword', value: 'def' },
  { type: 'ident', value: 'addition' },
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
  { type: 'slash', value: '/' },
  { type: 'number', value: '2' },
  { type: 'newline', value: '\n' },

  { type: 'ident', value: 'addition' },
  { type: 'lparen', value: '(' },
  { type: 'number', value: '1' },
  { type: 'comma', value: ',' },
  { type: 'number', value: '2' },
  { type: 'rparen', value: ')' },
  { type: 'newline', value: '\n' },
];

const ast: AST = [
  {
    type: 'FunctionDeclaration',
    return: DT.Void,
    name: 'addition',
    arguments: [
      { ident: 'x', type: DT.Num },
      { ident: 'y', type: DT.Num }
    ],
    outputType: DT.Num,
    body: [
      Arithmetic('x', '+', 'y'),
    ],
  },
  {
    type: 'FunctionInvokeExpr',
    name: 'addition',
    params: [
      NumberLiteral(1),
      NumberLiteral(2)
    ],
    return: DT.Num,
  },
  {
    type: 'FunctionDeclaration',
    return: DT.Void,
    name: 'addition$1',
    arguments: [
      { ident: 'x', type: DT.Num },
      { ident: 'y', type: DT.Num }
    ],
    outputType: DT.Num,
    body: [
      {
        type: 'BinaryOpExpr',
        operator: Op.Asterisk,
        return: DT.Num,
        expr1: {
          type: 'PrioritizedExpr',
          return: DT.Num,
          expr: Arithmetic('x', '+', 'y')
        },
        expr2: NumberLiteral(2)
      },
    ],
  },
  {
    type: 'FunctionInvokeExpr',
    name: 'addition$1',
    params: [
      NumberLiteral(1),
      NumberLiteral(2)
    ],
    return: DT.Num,
  },
  {
    type: 'FunctionDeclaration',
    return: DT.Void,
    name: 'addition$2',
    arguments: [
      { ident: 'x', type: DT.Num },
      { ident: 'y', type: DT.Num }
    ],
    outputType: DT.Num,
    body: [
      {
        type: 'BinaryOpExpr',
        operator: Op.Plus,
        return: DT.Num,
        expr1: { type: 'IdentLiteral', value: 'x', return: DT.Num },
        expr2: Arithmetic('y', '/', 2),
      },
    ],
  },
  {
    type: 'FunctionInvokeExpr',
    name: 'addition$2',
    params: [
      NumberLiteral(1),
      NumberLiteral(2)
    ],
    return: DT.Num,
  },
];

const compiled = `\
function addition(x, y) {
  return x + y;
}

addition(1, 2);
function addition$1(x, y) {
  return (x + y) * 2;
}

addition$1(1, 2);
function addition$2(x, y) {
  return x + (y / 2);
}

addition$2(1, 2);
`;

const minified = 'function addition(x,y){return x+y;}addition(1,2);function addition$1(x,y){return (x+y)*2;}addition$1(1,2);function addition$2(x,y){return x+(y/2);}addition$2(1,2);';

export {
  tokens,
  ast,
  compiled,
  minified,
};
