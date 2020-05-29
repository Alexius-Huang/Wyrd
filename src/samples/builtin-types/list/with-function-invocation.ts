import { Token, AST, Operator as Op } from '../../../types';
import { NumberLiteral, Arithmetic } from '../../helper';
import { DataType as DT } from '../../../parser/utils';

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

  { type: 'lbracket', value: '[' },
  { type: 'number', value: '1' },
  { type: 'ident', value: 'addition' },
  { type: 'lparen', value: '(' },
  { type: 'number', value: '2' },
  { type: 'comma', value: ',' },
  { type: 'number', value: '3' },
  { type: 'plus', value: '+' },
  { type: 'number', value: '4' },
  { type: 'asterisk', value: '*' },
  { type: 'number', value: '5' },
  { type: 'rparen', value: ')' },
  { type: 'number', value: '6' },
  { type: 'ident', value: 'addition' },
  { type: 'lparen', value: '(' },
  { type: 'number', value: '7' },
  { type: 'slash', value: '/' },
  { type: 'number', value: '8' },
  { type: 'dash', value: '-' },
  { type: 'number', value: '9' },
  { type: 'comma', value: ',' },
  { type: 'number', value: '10' },
  { type: 'rparen', value: ')' },
  { type: 'rbracket', value: ']' },
  { type: 'newline', value: '\n' },
];

const ast: AST = [
  {
    type: 'FunctionDeclaration',
    name: 'addition',
    return: DT.Void,
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
    type: 'ListLiteral',
    values: [
      NumberLiteral(1),
      {
        type: 'FunctionInvokeExpr',
        name: 'addition',
        params: [
          NumberLiteral(2),
          {
            type: 'BinaryOpExpr',
            operator: Op.Plus,
            return: DT.Num,
            expr1: NumberLiteral(3),
            expr2: Arithmetic(4, '*', 5),
          },
        ],
        return: DT.Num,
      },
      NumberLiteral(6),
      {
        type: 'FunctionInvokeExpr',
        name: 'addition',
        params: [
          {
            type: 'BinaryOpExpr',
            operator: Op.Dash,
            return: DT.Num,
            expr1: Arithmetic(7, '/', 8),
            expr2: NumberLiteral(9),
          },
          NumberLiteral(10),
        ],
        return: DT.Num,
      },
    ],
    elementType: DT.Num,
    return: DT.ListOf(DT.Num),
  },
];

const compiled = `\
function addition(x, y) {
  return x + y;
}

[1, addition(2, 3 + (4 * 5)), 6, addition(7 / 8 - 9, 10)];
`;

const minified = 'function addition(x,y){return x+y;}[1,addition(2,3+(4*5)),6,addition(7/8-9,10)];';

export {
  tokens,
  ast,
  compiled,
  minified,
};
