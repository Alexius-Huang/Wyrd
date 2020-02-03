import { Token, AST, Operator as Op } from '../../types';
import { NumberLiteral, prioritize, Arithmetic } from '../helper';

const program = `\
mutable foo = (1 + 2) * 3
mutable bar = 1 + 2 * (3 - 4)
bar = 1 * ((foo + bar) / 2)
`;

const tokens: Array<Token> = [
  { type: 'keyword', value: 'mutable' },
  { type: 'ident', value: 'foo' },
  { type: 'eq', value: '=' },
  { type: 'lparen', value: '(' },
  { type: 'number', value: '1' },
  { type: 'plus', value: '+' },
  { type: 'number', value: '2' },
  { type: 'rparen', value: ')' },
  { type: 'asterisk', value: '*' },
  { type: 'number', value: '3' },
  { type: 'newline', value: '\n' },

  { type: 'keyword', value: 'mutable' },
  { type: 'ident', value: 'bar' },
  { type: 'eq', value: '=' },
  { type: 'number', value: '1' },
  { type: 'plus', value: '+' },
  { type: 'number', value: '2' },
  { type: 'asterisk', value: '*' },
  { type: 'lparen', value: '(' },
  { type: 'number', value: '3' },
  { type: 'dash', value: '-' },
  { type: 'number', value: '4' },
  { type: 'rparen', value: ')' },
  { type: 'newline', value: '\n' },

  { type: 'ident', value: 'bar' },
  { type: 'eq', value: '=' },
  { type: 'number', value: '1' },
  { type: 'asterisk', value: '*' },
  { type: 'lparen', value: '(' },
  { type: 'lparen', value: '(' },
  { type: 'ident', value: 'foo' },
  { type: 'plus', value: '+' },
  { type: 'ident', value: 'bar' },
  { type: 'rparen', value: ')' },
  { type: 'slash', value: '/' },
  { type: 'number', value: '2' },
  { type: 'rparen', value: ')' },
  { type: 'newline', value: '\n' },
];

const ast: AST = [
  {
    type: 'VarDeclaration',
    returnType: 'Void',
    expr1: { type: 'IdentLiteral', value: 'foo', returnType: 'Num', },
    expr2: {
      type: 'BinaryOpExpr',
      operator: Op.Asterisk,
      returnType: 'Num',
      expr1: prioritize(Arithmetic(1, '+', 2)),
      expr2: NumberLiteral('3'),
    },
  },
  {
    type: 'VarDeclaration',
    returnType: 'Void',
    expr1: { type: 'IdentLiteral', value: 'bar', returnType: 'Num' },
    expr2: {
      type: 'BinaryOpExpr',
      operator: Op.Plus,
      returnType: 'Num',
      expr1: NumberLiteral('1'),
      expr2: {
        type: 'BinaryOpExpr',
        operator: Op.Asterisk,
        returnType: 'Num',
        expr1: NumberLiteral('2'),
        expr2: prioritize(Arithmetic(3, '-', 4)),
      },
    },
  },
  {
    type: 'VarAssignmentExpr',
    returnType: 'Void',
    expr1: { type: 'IdentLiteral', value: 'bar', returnType: 'Num' },
    expr2: {
      type: 'BinaryOpExpr',
      operator: Op.Asterisk,
      returnType: 'Num',
      expr1: NumberLiteral('1'),
      expr2: prioritize({
        type: 'BinaryOpExpr',
        operator: Op.Slash,
        returnType: 'Num',
        expr1: prioritize(Arithmetic('foo', '+', 'bar')),
        expr2: NumberLiteral('2'),
      }),
    },
  },
];

const compiled = `\
let foo = (1 + 2) * 3;
let bar = 1 + (2 * (3 - 4));
bar = 1 * ((foo + bar) / 2);
`;

export {
  program,
  tokens,
  ast,
  compiled,
};
