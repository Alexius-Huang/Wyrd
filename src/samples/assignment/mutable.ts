import { Token, AST, Operator as Op } from '../../types';

const program = `\
mutable foo = 123
foo = 456
foo = 1 * 2 - 3 / 4

mutable bar = 1 + 2 * 3 - 4
bar = 1 * foo + bar / 2
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
  { type: 'newline', value: '\n' },

  { type: 'keyword', value: 'mutable' },
  { type: 'ident', value: 'bar' },
  { type: 'eq', value: '=' },
  { type: 'number', value: '1' },
  { type: 'plus', value: '+' },
  { type: 'number', value: '2' },
  { type: 'asterisk', value: '*' },
  { type: 'number', value: '3' },
  { type: 'dash', value: '-' },
  { type: 'number', value: '4' },
  { type: 'newline', value: '\n' },

  { type: 'ident', value: 'bar' },
  { type: 'eq', value: '=' },
  { type: 'number', value: '1' },
  { type: 'asterisk', value: '*' },
  { type: 'ident', value: 'foo' },
  { type: 'plus', value: '+' },
  { type: 'ident', value: 'bar' },
  { type: 'slash', value: '/' },
  { type: 'number', value: '2' },
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
  {
    type: 'VarDeclaration',
    returnType: 'Void',
    expr1: { type: 'IdentLiteral', value: 'bar', returnType: 'Num' },
    expr2: {
      type: 'BinaryOpExpr',
      operator: Op.Dash,
      returnType: 'Num',
      expr1: {
        type: 'BinaryOpExpr',
        operator: Op.Plus,
        returnType: 'Num',
        expr1: { type: 'NumberLiteral', value: '1', returnType: 'Num' },
        expr2: {
          type: 'BinaryOpExpr',
          operator: Op.Asterisk,
          returnType: 'Num',
          expr1: { type: 'NumberLiteral', value: '2', returnType: 'Num' },
          expr2: { type: 'NumberLiteral', value: '3', returnType: 'Num' },
        },
      },
      expr2: { type: 'NumberLiteral', value: '4', returnType: 'Num' }
    },
  },
  {
    type: 'VarAssignmentExpr',
    returnType: 'Void',
    expr1: { type: 'IdentLiteral', value: 'bar', returnType: 'Num' },
    expr2: {
      type: 'BinaryOpExpr',
      operator: Op.Plus,
      returnType: 'Num',
      expr1: {
        type: 'BinaryOpExpr',
        operator: Op.Asterisk,
        returnType: 'Num',
        expr1: { type: 'NumberLiteral', value: '1', returnType: 'Num' },
        expr2: { type: 'IdentLiteral', value: 'foo', returnType: 'Num' },
      },
      expr2: {
        type: 'BinaryOpExpr',
        operator: Op.Slash,
        returnType: 'Num',
        expr1: { type: 'IdentLiteral', value: 'bar', returnType: 'Num' },
        expr2: { type: 'NumberLiteral', value: '2', returnType: 'Num' },
      },
    },
  },
];

const compiled = `\
let foo = 123;
foo = 456;
foo = 1 * 2 - (3 / 4);
let bar = 1 + (2 * 3) - 4;
bar = 1 * foo + (bar / 2);
`;

export {
  program,
  tokens,
  ast,
  compiled,
};
