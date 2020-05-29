import { Token, AST, Operator as Op } from '../../types';
import { NumberLiteral, prioritize, Arithmetic, Var } from '../helper';
import { DataType as DT } from '../../parser/utils';

const tokens: Array<Token> = [
  { type: 'ident', value: 'foo' },
  { type: 'eq', value: '=' },
  { type: 'number', value: '1' },
  { type: 'newline', value: '\n' },

  { type: 'ident', value: 'bar' },
  { type: 'eq', value: '=' },
  { type: 'number', value: '1' },
  { type: 'plus', value: '+' },
  { type: 'number', value: '2' },
  { type: 'asterisk', value: '*' },
  { type: 'number', value: '3' },
  { type: 'plus', value: '+' },
  { type: 'number', value: '4' },
  { type: 'newline', value: '\n' },

  { type: 'ident', value: 'baz' },
  { type: 'eq', value: '=' },
  { type: 'number', value: '1' },
  { type: 'plus', value: '+' },
  { type: 'lparen', value: '(' },
  { type: 'number', value: '2' },
  { type: 'dash', value: '-' },
  { type: 'number', value: '3' },
  { type: 'rparen', value: ')' },
  { type: 'asterisk', value: '*' },
  { type: 'number', value: '4' },
  { type: 'newline', value: '\n' },
];

const ast: AST = [
  {
    type: 'AssignmentExpr',
    return: DT.Void,
    expr1: Var('foo', DT.Num),
    expr2: NumberLiteral(1),
  },
  {
    type: 'AssignmentExpr',
    return: DT.Void,
    expr1: Var('bar', DT.Num),
    expr2: {
      type: 'BinaryOpExpr',
      operator: Op.Plus,
      return: DT.Num,
      expr1: {
        type: 'BinaryOpExpr',
        operator: Op.Plus,
        return: DT.Num,
        expr1: NumberLiteral(1),
        expr2: Arithmetic(2, '*', 3),
      },
      expr2: NumberLiteral(4),
    },
  },
  {
    type: 'AssignmentExpr',
    return: DT.Void,
    expr1: Var('baz', DT.Num),
    expr2: {
      type: 'BinaryOpExpr',
      operator: Op.Plus,
      return: DT.Num,
      expr1: NumberLiteral(1),
      expr2: {
        type: 'BinaryOpExpr',
        operator: Op.Asterisk,
        return: DT.Num,
        expr1: prioritize(Arithmetic(2, '-', 3)),
        expr2: NumberLiteral(4),
      },
    },
  },
];

const compiled = `\
const foo = 1;
const bar = 1 + (2 * 3) + 4;
const baz = 1 + ((2 - 3) * 4);
`;

const minified = 'const foo=1;const bar=1+(2*3)+4;const baz=1+((2-3)*4);';

export {
  tokens,
  ast,
  compiled,
  minified,
};
