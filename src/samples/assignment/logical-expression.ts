import { Token, AST, Operator as Op } from '../../types';
import { NumberLiteral, Arithmetic } from '../helper';

const program = `\
isTrue = 3 + 1 > 2
`;

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
    returnType: 'Void',
    expr1: { type: 'IdentLiteral', value: 'isTrue', returnType: 'Bool' },
    expr2: {
      type: 'BinaryOpExpr',
      operator: Op.Gt,
      returnType: 'Bool',
      expr1: Arithmetic(3, '+', 1),
      expr2: NumberLiteral('2'),
    },  
  },
];

const compiled = `\
const isTrue = 3 + 1 > 2;
`;

export {
  program,
  tokens,
  ast,
  compiled,
};
