import { Token, AST } from '../../types';

const program = `\
True and False or not False
not False and True
`;

const tokens: Array<Token> = [
  { type: 'boolean', value: 'True' },
  { type: 'keyword', value: 'and' },
  { type: 'boolean', value: 'False' },
  { type: 'keyword', value: 'or' },
  { type: 'keyword', value: 'not' },
  { type: 'boolean', value: 'False' },
  { type: 'newline', value: '\n' },

  { type: 'keyword', value: 'not' },
  { type: 'boolean', value: 'False' },
  { type: 'keyword', value: 'and' },
  { type: 'boolean', value: 'True' },
  { type: 'newline', value: '\n' },
];

const ast: AST = [
  {
    type: 'OrExpr',
    returnType: 'Bool',
    expr1: {
      type: 'AndExpr',
      returnType: 'Bool',
      expr1: { type: 'BooleanLiteral', value: 'True', returnType: 'Bool' },
      expr2: { type: 'BooleanLiteral', value: 'False', returnType: 'Bool' },
    },
    expr2: {
      type: 'NotExpr',
      returnType: 'Bool',
      expr: { type: 'BooleanLiteral', value: 'False', returnType: 'Bool' },
    },
  },
  {
    type: 'AndExpr',
    returnType: 'Bool',
    expr1: {
      type: 'NotExpr',
      returnType: 'Bool',
      expr: { type: 'BooleanLiteral', value: 'False', returnType: 'Bool' },
    },
    expr2: { type: 'BooleanLiteral', value: 'True', returnType: 'Bool' },
  },
];

const compiled = `\
true && false || !(false);
!(false) && true;
`;

export {
  program,
  tokens,
  ast,
  compiled,
};
