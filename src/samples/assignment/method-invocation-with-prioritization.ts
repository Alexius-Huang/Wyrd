import { Token, AST } from '../../types';
import { StringLiteral, Var, Arithmetic } from '../helper';
import { DataType as DT } from '../../parser/utils';

const tokens: Array<Token> = [
  { type: 'ident', value: 'foo' },
  { type: 'eq', value: '=' },
  { type: 'lparen', value: '(' },
  { type: 'number', value: '1' },
  { type: 'plus', value: '+' },
  { type: 'number', value: '2' },
  { type: 'rparen', value: ')' },
  { type: 'dot', value: '.' },
  { type: 'ident', value: 'toStr' },
  { type: 'lparen', value: '(' },
  { type: 'rparen', value: ')' },
  { type: 'dot', value: '.' },
  { type: 'ident', value: 'concat' },
  { type: 'lparen', value: '(' },
  { type: 'string', value: '123' },
  { type: 'rparen', value: ')' },
  { type: 'newline', value: '\n' },

  { type: 'keyword', value: 'mutable' },
  { type: 'ident', value: 'bar' },
  { type: 'eq', value: '=' },
  { type: 'lparen', value: '(' },
  { type: 'lparen', value: '(' },
  { type: 'number', value: '1' },
  { type: 'plus', value: '+' },
  { type: 'number', value: '2' },
  { type: 'rparen', value: ')' },
  { type: 'dot', value: '.' },
  { type: 'ident', value: 'toStr' },
  { type: 'lparen', value: '(' },
  { type: 'rparen', value: ')' },
  { type: 'rparen', value: ')' },
  { type: 'dot', value: '.' },
  { type: 'ident', value: 'concat' },
  { type: 'lparen', value: '(' },
  { type: 'string', value: '123' },
  { type: 'rparen', value: ')' },
  { type: 'newline', value: '\n' },

  { type: 'ident', value: 'bar' },
  { type: 'eq', value: '=' },
  { type: 'lparen', value: '(' },
  { type: 'lparen', value: '(' },
  { type: 'number', value: '1' },
  { type: 'plus', value: '+' },
  { type: 'number', value: '2' },
  { type: 'rparen', value: ')' },
  { type: 'dot', value: '.' },
  { type: 'ident', value: 'toStr' },
  { type: 'lparen', value: '(' },
  { type: 'rparen', value: ')' },
  { type: 'rparen', value: ')' },
  { type: 'dot', value: '.' },
  { type: 'ident', value: 'concat' },
  { type: 'lparen', value: '(' },
  { type: 'string', value: '123' },
  { type: 'rparen', value: ')' },
  { type: 'newline', value: '\n' },
];

const ast: AST = [
  {
    type: 'AssignmentExpr',
    return: DT.Void,
    expr1: Var('foo', DT.Str),
    expr2: {
      type: 'MethodInvokeExpr',
      name: 'concat',
      receiver: {
        type: 'MethodInvokeExpr',
        name: 'toString',
        receiver: Arithmetic(1, '+', 2),
        params: [],
        return: DT.Str,
      },
      params: [
        StringLiteral('123'),
      ],
      return: DT.Str,
    },
  },
  {
    type: 'VarDeclaration',
    return: DT.Void,
    expr1: Var('bar', DT.Str),
    expr2: {
      type: 'MethodInvokeExpr',
      name: 'concat',
      receiver: {
        type: 'MethodInvokeExpr',
        name: 'toString',
        receiver: Arithmetic(1, '+', 2),
        params: [],
        return: DT.Str,
      },
      params: [
        StringLiteral('123'),
      ],
      return: DT.Str,
    },
  },
  {
    type: 'VarAssignmentExpr',
    return: DT.Void,
    expr1: Var('bar', DT.Str),
    expr2: {
      type: 'MethodInvokeExpr',
      name: 'concat',
      receiver: {
        type: 'MethodInvokeExpr',
        name: 'toString',
        receiver: Arithmetic(1, '+', 2),
        params: [],
        return: DT.Str,
      },
      params: [
        StringLiteral('123'),
      ],
      return: DT.Str,
    },
  },
];

const compiled = `\
const foo = (1 + 2).toString().concat('123');
let bar = (1 + 2).toString().concat('123');
bar = (1 + 2).toString().concat('123');
`;

const minified = 'const foo=(1+2).toString().concat(\'123\');let bar=(1+2).toString().concat(\'123\');bar=(1+2).toString().concat(\'123\');';

export {
  tokens,
  ast,
  compiled,
  minified,
};
