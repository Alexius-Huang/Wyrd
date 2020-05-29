import { Token, AST, Operator as Op } from '../../types';
import { NumberLiteral, Arithmetic, Var } from '../helper';
import { DataType as DT } from '../../parser/utils';

const tokens: Array<Token> = [
  { type: 'ident', value: 'isTrue' },
  { type: 'eq', value: '=' },
  { type: 'number', value: '3' },
  { type: 'plus', value: '+' },
  { type: 'number', value: '1' },
  { type: 'gt', value: '>' },
  { type: 'number', value: '2' },
  { type: 'newline', value: '\n' },
];

const ast: AST = [
  {
    type: 'AssignmentExpr',
    return: DT.Void,
    expr1: Var('isTrue', DT.Bool),
    expr2: {
      type: 'BinaryOpExpr',
      operator: Op.Gt,
      return: DT.Bool,
      expr1: Arithmetic(3, '+', 1),
      expr2: NumberLiteral(2),
    },  
  },
];

const compiled = `\
const isTrue = 3 + 1 > 2;
`;

const minified = 'const isTrue=3+1>2;';

export {
  tokens,
  ast,
  compiled,
  minified,
};
