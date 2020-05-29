import { Token, AST, Operator as Op } from '../../../types';
import { NumberLiteral, prioritize, Arithmetic } from '../../helper';
import { DataType as DT } from '../../../parser/utils';

const tokens: Array<Token> = [
  { type: 'lbracket', value: '[' },
  { type: 'number', value: '1' },
  { type: 'lparen', value: '(' },
  { type: 'number', value: '2' },
  { type: 'plus', value: '+' },
  { type: 'number', value: '3' },
  { type: 'asterisk', value: '*' },
  { type: 'number', value: '4' },
  { type: 'rparen', value: ')' },
  { type: 'lparen', value: '(' },
  { type: 'number', value: '5' },
  { type: 'slash', value: '/' },
  { type: 'lparen', value: '(' },
  { type: 'number', value: '6' },
  { type: 'dash', value: '-' },
  { type: 'number', value: '7' },
  { type: 'rparen', value: ')' },
  { type: 'rparen', value: ')' },
  { type: 'number', value: '8' },
  { type: 'lparen', value: '(' },
  { type: 'number', value: '9' },
  { type: 'rparen', value: ')' },
  { type: 'number', value: '10' },
  { type: 'rbracket', value: ']' },
  { type: 'newline', value: '\n' },
];

const ast: AST = [
  {
    type: 'ListLiteral',
    values: [
      NumberLiteral(1),
      {
        type: 'BinaryOpExpr',
        operator: Op.Plus,
        return: DT.Num,
        expr1: NumberLiteral(2),
        expr2: Arithmetic(3, '*', 4),
      },
      {
        type: 'BinaryOpExpr',
        operator: Op.Slash,
        return: DT.Num,
        expr1: NumberLiteral(5),
        expr2: prioritize(Arithmetic(6, '-', 7)),
      },
      NumberLiteral(8),
      NumberLiteral(9),
      NumberLiteral(10),
    ],
    elementType: DT.Num,
    return: DT.ListOf(DT.Num),
  },
];

const compiled = `\
[1, 2 + (3 * 4), 5 / (6 - 7), 8, 9, 10];
`;

const minified = '[1,2+(3*4),5/(6-7),8,9,10];';

export {
  tokens,
  ast,
  compiled,
  minified,
};
