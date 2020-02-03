import { Token, AST, Operator as Op } from '../../types';

const program = `\
mutable foo = 123
foo = 456
foo = 1 * 2 - 3 / 4
`;

const tokens: Array<Token> = [
  { type: 'keyword', value: 'mutable' },
  { type: 'ident', value: 'foo' },
  { type: 'eq', value: '=' },
  { type: 'number', value: '123' },
  { type: 'newline', value: '\n' },

  { type: 'ident', value: 'foo' },
  { type: 'eq', value: '=' },
  { type: 'number', value: '456' },
  { type: 'newline', value: '\n' },

  { type: 'ident', value: 'foo' },
  { type: 'eq', value: '=' },
  { type: 'number', value: '1' },
  { type: 'asterisk', value: '*' },
  { type: 'number', value: '2' },
  { type: 'dash', value: '-' },
  { type: 'number', value: '3' },
  { type: 'slash', value: '/' },
  { type: 'number', value: '4' },
  { type: 'newline', value: '\n' },
];

const ast: AST = [
  {
    type: 'VarDeclaration',
    returnType: 'Void',
    expr1: { type: 'IdentLiteral', value: 'foo', returnType: 'Num', },
    expr2: { type: 'NumberLiteral', value: '123', returnType: 'Num' },
  },
  {
    type: 'VarAssignmentExpr',
    returnType: 'Void',
    expr1: { type: 'IdentLiteral', value: 'foo', returnType: 'Num', },
    expr2: { type: 'NumberLiteral', value: '456', returnType: 'Num' },
  },
  {
    type: 'VarAssignmentExpr',
    returnType: 'Void',
    expr1: { type: 'IdentLiteral', value: 'foo', returnType: 'Num', },
    expr2: {
      type: 'BinaryOpExpr',
      operator: Op.Dash,
      returnType: 'Num',
      expr1: {
        type: 'BinaryOpExpr',
        operator: Op.Asterisk,
        returnType: 'Num',
        expr1: { type: 'NumberLiteral', value: '1', returnType: 'Num' },
        expr2: { type: 'NumberLiteral', value: '2', returnType: 'Num' },
      },
      expr2: {
        type: 'BinaryOpExpr',
        operator: Op.Slash,
        returnType: 'Num',
        expr1: { type: 'NumberLiteral', value: '3', returnType: 'Num' },
        expr2: { type: 'NumberLiteral', value: '4', returnType: 'Num' },
      },
    },
  },
];

const compiled = `\
let foo = 123;
foo = 456;
foo = 1 * 2 - (3 / 4);
`;

export {
  program,
  tokens,
  ast,
  compiled,
};
