import { Token, AST, Operator as Op } from '../../types';
import { NumberLiteral, Arithmetic } from '../helper';
import { DataType as DT } from '../../parser/utils';

const tokens: Array<Token> = [
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
  { type: 'newline', value: '\n' },
];

const ast: AST = [
  {
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
];

const compiled = `\
(1 + (2 * 3)).toString();
`;

const minified = '(1+(2*3)).toString();';

export {
  tokens,
  ast,
  compiled,
  minified,
};
