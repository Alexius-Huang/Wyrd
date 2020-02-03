import { Token, AST, Operator as Op } from '../../types';
import { NumberLiteral, Arithmetic, Var } from '../helper';

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
    expr1: Var('foo', 'Num'),
    expr2: NumberLiteral('123'),
  },
  {
    type: 'VarAssignmentExpr',
    returnType: 'Void',
    expr1: Var('foo', 'Num'),
    expr2: NumberLiteral('456'),
  },
  {
    type: 'VarAssignmentExpr',
    returnType: 'Void',
    expr1: Var('foo', 'Num'),
    expr2: {
      type: 'BinaryOpExpr',
      operator: Op.Dash,
      returnType: 'Num',
      expr1: Arithmetic(1, '*', 2),
      expr2: Arithmetic(3, '/', 4),
    },
  },
  {
    type: 'VarDeclaration',
    returnType: 'Void',
    expr1: Var('bar', 'Num'),
    expr2: {
      type: 'BinaryOpExpr',
      operator: Op.Dash,
      returnType: 'Num',
      expr1: {
        type: 'BinaryOpExpr',
        operator: Op.Plus,
        returnType: 'Num',
        expr1: NumberLiteral('1'),
        expr2: Arithmetic(2, '*', 3),
      },
      expr2: NumberLiteral('4')
    },
  },
  {
    type: 'VarAssignmentExpr',
    returnType: 'Void',
    expr1: Var('bar', 'Num'),
    expr2: {
      type: 'BinaryOpExpr',
      operator: Op.Plus,
      returnType: 'Num',
      expr1: Arithmetic(1, '*', 'foo'),
      expr2: Arithmetic('bar', '/', 2),
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
