import { Token, AST } from '../../types';
import { StringLiteral, Var, NumberLiteral } from '../helper';
import { DataType as DT } from '../../parser/utils';

const tokens: Array<Token> = [
  { type: 'ident', value: 'foo' },
  { type: 'eq', value: '=' },
  { type: 'string', value: 'Hello world' },
  { type: 'dot', value: '.' },
  { type: 'ident', value: 'concat' },
  { type: 'lparen', value: '(' },
  { type: 'string', value: 'Wyrd-Lang' },
  { type: 'rparen', value: ')' },
  { type: 'dot', value: '.' },
  { type: 'ident', value: 'concat' },
  { type: 'lparen', value: '(' },
  { type: 'string', value: ' is awesome!' },
  { type: 'rparen', value: ')' },
  { type: 'newline', value: '\n' },

  { type: 'keyword', value: 'mutable' },
  { type: 'ident', value: 'bar' },
  { type: 'eq', value: '=' },
  { type: 'number', value: '123' },
  { type: 'dot', value: '.' },
  { type: 'ident', value: 'toStr' },
  { type: 'lparen', value: '(' },
  { type: 'rparen', value: ')' },
  { type: 'dot', value: '.' },
  { type: 'ident', value: 'concat' },
  { type: 'lparen', value: '(' },
  { type: 'string', value: '666' },
  { type: 'rparen', value: ')' },
  { type: 'newline', value: '\n' },

  { type: 'ident', value: 'bar' },
  { type: 'eq', value: '=' },
  { type: 'number', value: '666' },
  { type: 'dot', value: '.' },
  { type: 'ident', value: 'toStr' },
  { type: 'lparen', value: '(' },
  { type: 'rparen', value: ')' },
  { type: 'dot', value: '.' },
  { type: 'ident', value: 'upcase' },
  { type: 'lparen', value: '(' },
  { type: 'rparen', value: ')' },
  { type: 'newline', value: '\n' },
  { type: 'newline', value: '\n' },

  { type: 'ident', value: 'baz' },
  { type: 'eq', value: '=' },
  { type: 'ident', value: 'foo' },
  { type: 'dot', value: '.' },
  { type: 'ident', value: 'downcase' },
  { type: 'lparen', value: '(' },
  { type: 'rparen', value: ')' },
  { type: 'dot', value: '.' },
  { type: 'ident', value: 'between' },
  { type: 'lparen', value: '(' },
  { type: 'number', value: '1' },
  { type: 'comma', value: ',' },
  { type: 'number', value: '2' },
  { type: 'rparen', value: ')' },
  { type: 'newline', value: '\n' },

  { type: 'keyword', value: 'mutable' },
  { type: 'ident', value: 'bazz' },
  { type: 'eq', value: '=' },
  { type: 'ident', value: 'baz' },
  { type: 'dot', value: '.' },
  { type: 'ident', value: 'concat' },
  { type: 'lparen', value: '(' },
  { type: 'string', value: 'Wyrd-Lang' },
  { type: 'rparen', value: ')' },
  { type: 'dot', value: '.' },
  { type: 'ident', value: 'repeat' },
  { type: 'lparen', value: '(' },
  { type: 'number', value: '123' },
  { type: 'rparen', value: ')' },
  { type: 'newline', value: '\n' },

  { type: 'ident', value: 'bar' },
  { type: 'eq', value: '=' },
  { type: 'ident', value: 'bazz' },
  { type: 'dot', value: '.' },
  { type: 'ident', value: 'concat' },
  { type: 'lparen', value: '(' },
  { type: 'string', value: 'hello' },
  { type: 'rparen', value: ')' },
  { type: 'dot', value: '.' },
  { type: 'ident', value: 'toStr' },
  { type: 'lparen', value: '(' },
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
        name: 'concat',
        receiver: StringLiteral('Hello world'),
        params: [
          StringLiteral('Wyrd-Lang'),
        ],
        return: DT.Str,
      },
      params: [
        StringLiteral(' is awesome!'),
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
        receiver: NumberLiteral(123),
        params: [],
        return: DT.Str,
      },
      params: [
        StringLiteral('666')
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
      name: 'toUpperCase',
      receiver: {
        type: 'MethodInvokeExpr',
        name: 'toString',
        receiver: NumberLiteral(666),
        params: [],
        return: DT.Str,
      },
      params: [],
      return: DT.Str,
    },
  },
  {
    type: 'AssignmentExpr',
    return: DT.Void,
    expr1: Var('baz', DT.Str),
    expr2: {
      type: 'MethodInvokeExpr',
      name: 'slice',
      receiver: {
        type: 'MethodInvokeExpr',
        name: 'toLowerCase',
        receiver: Var('foo', DT.Str),
        params: [],
        return: DT.Str,
      },
      params: [
        NumberLiteral(1),
        NumberLiteral(2),
      ],
      return: DT.Str,
    },
  },
  {
    type: 'VarDeclaration',
    return: DT.Void,
    expr1: Var('bazz', DT.Str),
    expr2: {
      type: 'MethodInvokeExpr',
      name: 'repeat',
      receiver: {
        type: 'MethodInvokeExpr',
        name: 'concat',
        receiver: Var('baz', DT.Str),
        params: [
          StringLiteral('Wyrd-Lang'),
        ],
        return: DT.Str,
      },
      params: [
        NumberLiteral(123),
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
      name: 'toString',
      receiver: {
        type: 'MethodInvokeExpr',
        name: 'concat',
        receiver: Var('bazz', DT.Str),
        params: [
          StringLiteral('hello')
        ],
        return: DT.Str,
      },
      params: [],
      return: DT.Str,
    },
  },
];

const compiled = `\
const foo = ('Hello world').concat('Wyrd-Lang').concat(' is awesome!');
let bar = (123).toString().concat('666');
bar = (666).toString().toUpperCase();
const baz = foo.toLowerCase().slice(1, 2);
let bazz = baz.concat('Wyrd-Lang').repeat(123);
bar = bazz.concat('hello').toString();
`;

const minified = 'const foo=(\'Hello world\').concat(\'Wyrd-Lang\').concat(\' is awesome!\');let bar=(123).toString().concat(\'666\');bar=(666).toString().toUpperCase();const baz=foo.toLowerCase().slice(1,2);let bazz=baz.concat(\'Wyrd-Lang\').repeat(123);bar=bazz.concat(\'hello\').toString();';

export {
  tokens,
  ast,
  compiled,
  minified,
};
