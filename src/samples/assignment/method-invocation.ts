import { Token, AST } from '../../types';
import { StringLiteral, Var, NumberLiteral } from '../helper';
import { DataType as DT } from '../../parser/utils';

const program = `\
foo = "Hello world".concat("Wyrd-Lang").concat(" is awesome!")
mutable bar = 123.toStr().concat("666")
bar = 666.toStr().upcase()
`;

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
  }
];

const compiled = `\
const foo = ('Hello world').concat('Wyrd-Lang').concat(' is awesome!');
let bar = (123).toString().concat('666');
bar = (666).toString().toUpperCase();
`;

const minified = 'const foo=(\'Hello world\').concat(\'Wyrd-Lang\').concat(\' is awesome!\');let bar=(123).toString().concat(\'666\');bar=(666).toString().toUpperCase();';

export {
  program,
  tokens,
  ast,
  compiled,
  minified,
};
