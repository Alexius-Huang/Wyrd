import { Token, AST, Operator as Op } from '../../types';

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
      expr1: {
        type: 'BinaryOpExpr',
        operator: Op.Plus,
        returnType: 'Num',
        expr1: { type: 'NumberLiteral', value: '3', returnType: 'Num' },
        expr2: { type: 'NumberLiteral', value: '1', returnType: 'Num' }
      },
      expr2: { type: 'NumberLiteral', value: '2', returnType: 'Num' }
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
