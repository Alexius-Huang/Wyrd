import { Token, AST, Operator as Op } from '../../types';
import { NumberLiteral, StringLiteral, Arithmetic } from '../helper';
import { DataType as DT } from '../../parser/utils';

const tokens: Array<Token> = [
  { type: 'string', value: 'Hello world' },
  { type: 'dot', value: '.' },
  { type: 'ident', value: 'upcase' },
  { type: 'lparen', value: '(' },
  { type: 'rparen', value: ')' },
  { type: 'dot', value: '.' },
  { type: 'ident', value: 'repeat' },
  { type: 'lparen', value: '(' },
  { type: 'number', value: '3' },
  { type: 'rparen', value: ')' },
  { type: 'newline', value: '\n' },

  { type: 'lparen', value: '(' },
  { type: 'number', value: '1' },
  { type: 'plus', value: '+' },
  { type: 'number', value: '2' },
  { type: 'asterisk', value: '*' },
  { type: 'number', value: '3' },
  { type: 'rparen', value: ')' },
  { type: 'dot', value: '.' },
  { type: 'ident', value: 'toStr' },
  { type: 'lparen', value: '(' },
  { type: 'rparen', value: ')' },
  { type: 'dot', value: '.' },
  { type: 'ident', value: 'repeat' },
  { type: 'lparen', value: '(' },
  { type: 'number', value: '3' },
  { type: 'rparen', value: ')' },
  { type: 'newline', value: '\n' },
];

const ast: AST = [
  {
    type: 'MethodInvokeExpr',
    name: 'repeat',
    receiver: {
      type: 'MethodInvokeExpr',
      name: 'toUpperCase',
      receiver: StringLiteral('Hello world'),
      params: [],
      return: DT.Str,
    },
    params: [
      NumberLiteral(3),
    ],
    return: DT.Str,
  },
  {
    type: 'MethodInvokeExpr',
    name: 'repeat',
    receiver: {
      type: 'MethodInvokeExpr',
      name: 'toString',
      receiver: {
        type: 'BinaryOpExpr',
        operator: Op.Plus,
        return: DT.Num,
        expr1: NumberLiteral(1),
        expr2: Arithmetic(2, '*', 3),
      },
      params: [],
      return: DT.Str,
    },
    params: [
      NumberLiteral(3),
    ],
    return: DT.Str,
  },
];

const compiled = `\
('Hello world').toUpperCase().repeat(3);
(1 + (2 * 3)).toString().repeat(3);
`;

const minified = '(\'Hello world\').toUpperCase().repeat(3);(1+(2*3)).toString().repeat(3);';

export {
  tokens,
  ast,
  compiled,
  minified,
};
