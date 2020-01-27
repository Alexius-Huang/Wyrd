import { Token, AST } from '../../types';

const program = `\
not (False or True) and False
`;

const tokens: Array<Token> = [
  { type: 'keyword', value: 'not' },
  { type: 'lparen', value: '(' },
  { type: 'boolean', value: 'False' },
  { type: 'keyword', value: 'or' },
  { type: 'boolean', value: 'True' },
  { type: 'rparen', value: ')' },
  { type: 'keyword', value: 'and' },
  { type: 'boolean', value: 'False' },
  { type: 'newline', value: '\n' },
];

const ast: AST = [
  {
    type: 'AndExpr',
    returnType: 'Bool',
    expr1: {
      type: 'NotExpr',
      returnType: 'Bool',
      expr: {
        type: 'PrioritizedExpr',
        returnType: 'Bool',
        expr: {
          type: 'OrExpr',
          returnType: 'Bool',
          expr1: { type: 'BooleanLiteral', value: 'False', returnType: 'Bool' },
          expr2: { type: 'BooleanLiteral', value: 'True', returnType: 'Bool' },
        },
      },
    },
    expr2: { type: 'BooleanLiteral', value: 'False', returnType: 'Bool' }
  },
];

const compiled = `\
!(false || true) && false;
`;

export {
  program,
  tokens,
  ast,
  compiled,
};
