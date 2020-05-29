import { Token, AST, Operator as Op } from '../../types';
import { Arithmetic, Var, NullLiteral, StringLiteral } from '../helper';
import { DataType as DT } from '../../parser/utils';

const tokens: Array<Token> = [
  { type: 'keyword', value: 'mutable' },
  { type: 'ident', value: 'foo' },
  { type: 'keyword', value: 'maybe' },
  { type: 'builtin-type', value: 'Num' },
  { type: 'eq', value: '=' },
  { type: 'number', value: '123' },
  { type: 'plus', value: '+' },
  { type: 'number', value: '456' },
  { type: 'newline', value: '\n' },

  { type: 'ident', value: 'foo' },
  { type: 'eq', value: '=' },
  { type: 'null', value: 'Null' },
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
  { type: 'keyword', value: 'maybe' },
  { type: 'builtin-type', value: 'Str' },
  { type: 'newline', value: '\n' },

  { type: 'ident', value: 'bar' },
  { type: 'eq', value: '=' },
  { type: 'string', value: 'Hello world!' },
  { type: 'dot', value: '.' },
  { type: 'ident', value: 'concat' },
  { type: 'lparen', value: '(' },
  { type: 'string', value: ' Wyrd-Lang!' },
  { type: 'rparen', value: ')' },
  { type: 'newline', value: '\n' },

  { type: 'ident', value: 'bar' }, 
  { type: 'eq', value: '=' },
  { type: 'null', value: 'Null' },
  { type: 'newline', value: '\n' },
];

const ast: AST = [
  {
    type: 'VarDeclaration',
    return: DT.Void,
    expr1: Var('foo', DT.Maybe.Num),
    expr2: Arithmetic(123, '+', 456),
  },
  {
    type: 'VarAssignmentExpr',
    return: DT.Void,
    expr1: Var('foo', DT.Maybe.Num),
    expr2: NullLiteral(),
  },
  {
    type: 'VarAssignmentExpr',
    return: DT.Void,
    expr1: Var('foo', DT.Maybe.Num),
    expr2: {
      type: 'BinaryOpExpr',
      operator: Op.Dash,
      return: DT.Num,
      expr1: Arithmetic(1, '*', 2),
      expr2: Arithmetic(3, '/', 4),
    },
  },
  {
    type: 'VarDeclaration',
    return: DT.Void,
    expr1: Var('bar', DT.Maybe.Str),
    expr2: NullLiteral(),
  },
  {
    type: 'VarAssignmentExpr',
    return: DT.Void,
    expr1: Var('bar', DT.Maybe.Str),
    expr2: {
      type: 'MethodInvokeExpr',
      name: 'concat',
      receiver: StringLiteral('Hello world!'),
      params: [
        StringLiteral(' Wyrd-Lang!'),
      ],
      return: DT.Str,
    },
  },
  {
    type: 'VarAssignmentExpr',
    return: DT.Void,
    expr1: Var('bar', DT.Maybe.Str),
    expr2: NullLiteral(),
  },
];

const compiled = `\
let foo = 123 + 456;
foo = null;
foo = 1 * 2 - (3 / 4);
let bar = null;
bar = ('Hello world!').concat(' Wyrd-Lang!');
bar = null;
`;

const minified = 'let foo=123+456;foo=null;foo=1*2-(3/4);let bar=null;bar=(\'Hello world!\').concat(\' Wyrd-Lang!\');bar=null;';

export {
  tokens,
  ast,
  compiled,
  minified,
};
