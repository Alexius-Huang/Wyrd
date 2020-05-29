import { Token, AST, Operator as Op } from '../../types';
import { NumberLiteral, prioritize, Arithmetic } from '../helper';
import { DataType as DT } from '../../parser/utils';

const tokens: Array<Token> = [
  { type: 'lparen', value: '(' },
  { type: 'number', value: '1' },
  { type: 'plus', value: '+' },
  { type: 'number', value: '2' },
  { type: 'rparen', value: ')' },
  { type: 'asterisk', value: '*' },
  { type: 'number', value: '3' },
  { type: 'newline', value: '\n' },

  { type: 'number', value: '1' },
  { type: 'asterisk', value: '*' },
  { type: 'lparen', value: '(' },
  { type: 'number', value: '2' },
  { type: 'plus', value: '+' },
  { type: 'number', value: '3' },
  { type: 'rparen', value: ')' },
  { type: 'newline', value: '\n' },

  { type: 'lparen', value: '(' },
  { type: 'number', value: '1' },
  { type: 'plus', value: '+' },
  { type: 'number', value: '2' },
  { type: 'rparen', value: ')' },
  { type: 'asterisk', value: '*' },
  { type: 'lparen', value: '(' },
  { type: 'number', value: '3' },
  { type: 'plus', value: '+' },
  { type: 'number', value: '4' },
  { type: 'rparen', value: ')' },
  { type: 'newline', value: '\n' },

  { type: 'lparen', value: '(' },
  { type: 'number', value: '1' },
  { type: 'plus', value: '+' },
  { type: 'lparen', value: '(' },
  { type: 'number', value: '5' },
  { type: 'dash', value: '-' },
  { type: 'number', value: '3' },
  { type: 'rparen', value: ')' },
  { type: 'rparen', value: ')' },
  { type: 'asterisk', value: '*' },
  { type: 'lparen', value: '(' },
  { type: 'number', value: '10' },
  { type: 'slash', value: '/' },
  { type: 'number', value: '5' },
  { type: 'rparen', value: ')' },
  { type: 'newline', value: '\n' },
];

const ast: AST = [
  {
    type: 'BinaryOpExpr',
    operator: Op.Asterisk,
    return: DT.Num,
    expr1: prioritize(Arithmetic(1, '+', 2)),
    expr2: NumberLiteral(3),
  },
  {
    type: 'BinaryOpExpr',
    operator: Op.Asterisk,
    return: DT.Num,
    expr1: NumberLiteral(1),
    expr2: prioritize(Arithmetic(2, '+', 3)),
  },
  {
    type: 'BinaryOpExpr',
    operator: Op.Asterisk,
    return: DT.Num,
    expr1: prioritize(Arithmetic(1, '+', 2)),
    expr2: prioritize(Arithmetic(3, '+', 4)),
  },
  {
    type: 'BinaryOpExpr',
    operator: Op.Asterisk,
    return: DT.Num,
    expr1: prioritize({
      type: 'BinaryOpExpr',
      operator: Op.Plus,
      return: DT.Num,
      expr1: NumberLiteral(1),
      expr2: prioritize(Arithmetic(5, '-', 3)),
    }),
    expr2: prioritize(Arithmetic(10, '/', 5)),
  },
];

const compiled = `\
(1 + 2) * 3;
1 * (2 + 3);
(1 + 2) * (3 + 4);
(1 + (5 - 3)) * (10 / 5);
`;

const minified = '(1+2)*3;1*(2+3);(1+2)*(3+4);(1+(5-3))*(10/5);';

export {
  tokens,
  ast,
  compiled,
  minified,
};
