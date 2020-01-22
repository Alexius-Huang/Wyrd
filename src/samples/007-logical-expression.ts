import { Token, AST, Operator as Op } from '../types';

const program = `\
True and False or not False
not False and True
not (False or True)
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

  { type: 'keyword', value: 'not' },
  { type: 'lparen', value: '(' },
  { type: 'boolean', value: 'False' },
  { type: 'keyword', value: 'or' },
  { type: 'boolean', value: 'True' },
  { type: 'rparen', value: ')' },
  { type: 'newline', value: '\n' },
];

const ast: AST = [
  {
    type: 'OrExpr',
    expr1: {
      type: 'AndExpr',
      expr1: { type: 'BooleanLiteral', value: 'True' },
      expr2: { type: 'BooleanLiteral', value: 'False' },
    },
    expr2: {
      type: 'NotExpr',
      expr: { type: 'BooleanLiteral', value: 'False' },
    },
  },
  {
    type: 'AndExpr',
    expr1: {
      type: 'NotExpr',
      expr: { type: 'BooleanLiteral', value: 'False' },
    },
    expr2: { type: 'BooleanLiteral', value: 'True' },
  },
  {
    type: 'NotExpr',
    expr: {
      type: 'PrioritizedExpr',
      expr: {
        type: 'OrExpr',
        expr1: { type: 'BooleanLiteral', value: 'False' },
        expr2: { type: 'BooleanLiteral', value: 'True' },
      },
    },
  },
];

const compiled = `\
true && false || !false;
!false && true;
!(false || true);
`;

export {
  program,
  tokens,
  ast,
  compiled,
};
