import { Token, AST, Operator as Op } from '../../types';
import { NumberLiteral, Arithmetic } from '../helper';
import { DataType as DT } from '../../parser/utils';

const tokens: Array<Token> = [
  { type: 'number', value: '1' },
  { type: 'plus', value: '+' },
  { type: 'number', value: '2' },
  { type: 'asterisk', value: '*' },
  { type: 'number', value: '3' },
  { type: 'newline', value: '\n' },

  { type: 'number', value: '1' },
  { type: 'asterisk', value: '*' },
  { type: 'number', value: '2' },
  { type: 'plus', value: '+' },
  { type: 'number', value: '3' },
  { type: 'newline', value: '\n' },

  { type: 'number', value: '1' },
  { type: 'plus', value: '+' },
  { type: 'number', value: '2' },
  { type: 'asterisk', value: '*' },
  { type: 'number', value: '3' },
  { type: 'plus', value: '+' },
  { type: 'number', value: '4' },
  { type: 'newline', value: '\n' },

  { type: 'number', value: '1' },
  { type: 'asterisk', value: '*' },
  { type: 'number', value: '2' },
  { type: 'plus', value: '+' },
  { type: 'number', value: '3' },
  { type: 'asterisk', value: '*' },
  { type: 'number', value: '4' },
  { type: 'newline', value: '\n' },

  { type: 'number', value: '1' },
  { type: 'plus', value: '+' },
  { type: 'number', value: '2' },
  { type: 'asterisk', value: '*' },
  { type: 'number', value: '3' },
  { type: 'asterisk', value: '*' },
  { type: 'number', value: '4' },
  { type: 'newline', value: '\n' },

  { type: 'number', value: '1' },
  { type: 'asterisk', value: '*' },
  { type: 'number', value: '2' },
  { type: 'plus', value: '+' },
  { type: 'number', value: '3' },
  { type: 'plus', value: '+' },
  { type: 'number', value: '4' },
  { type: 'newline', value: '\n' },
];

const ast: AST = [
  {
    type: 'BinaryOpExpr',
    operator: Op.Plus,
    return: DT.Num,
    expr1: NumberLiteral(1),
    expr2: Arithmetic(2, '*', 3),
  },
  {
    type: 'BinaryOpExpr',
    operator: Op.Plus,
    return: DT.Num,
    expr1: Arithmetic(1, '*', 2),
    expr2: NumberLiteral(3),
  },
  {
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
  {
    type: 'BinaryOpExpr',
    operator: Op.Plus,
    return: DT.Num,
    expr1: Arithmetic(1, '*', 2),
    expr2: Arithmetic(3, '*', 4),
  },
  {
    type: 'BinaryOpExpr',
    operator: Op.Plus,
    return: DT.Num,
    expr1: NumberLiteral(1),
    expr2: {
      type: 'BinaryOpExpr',
      operator: Op.Asterisk,
      return: DT.Num,
      expr1: Arithmetic(2, '*', 3),
      expr2: NumberLiteral(4),
    }
  },
  {
    type: 'BinaryOpExpr',
    operator: Op.Plus,
    return: DT.Num,
    expr1: {
      type: 'BinaryOpExpr',
      operator: Op.Plus,
      return: DT.Num,
      expr1: Arithmetic(1, '*', 2),
      expr2: NumberLiteral(3),
    },
    expr2: NumberLiteral(4),
  },
];

const compiled = `\
1 + (2 * 3);
1 * 2 + 3;
1 + (2 * 3) + 4;
1 * 2 + (3 * 4);
1 + (2 * 3 * 4);
1 * 2 + 3 + 4;
`;

const minified = '1+(2*3);1*2+3;1+(2*3)+4;1*2+(3*4);1+(2*3*4);1*2+3+4;';

export {
  tokens,
  ast,
  compiled,
  minified,
};
