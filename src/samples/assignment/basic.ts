import { Token, AST } from '../../types';
import { DataType as DT } from '../../parser/utils';
import * as helper from '../helper';

const tokens: Array<Token> = [
  { type: 'ident', value: 'foo' },
  { type: 'eq', value: '=' },
  { type: 'number', value: '123' },
  { type: 'newline', value: '\n' },

  { type: 'ident', value: 'bar' },
  { type: 'eq', value: '=' },
  { type: 'string', value: 'Hello world' },
  { type: 'newline', value: '\n' },

  { type: 'ident', value: 'baz' },
  { type: 'eq', value: '=' },
  { type: 'boolean', value: 'True' },
  { type: 'newline', value: '\n' },

  { type: 'ident', value: 'nothing' },
  { type: 'eq', value: '=' },
  { type: 'null', value: 'Null' },
  { type: 'newline', value: '\n' },

  { type: 'ident', value: 'list' },
  { type: 'eq', value: '=' },
  { type: 'lbracket', value: '[' },
  { type: 'number', value: '1' },
  { type: 'number', value: '2' },
  { type: 'number', value: '3' },
  { type: 'number', value: '4' },
  { type: 'number', value: '5' },
  { type: 'rbracket', value: ']' },
  { type: 'newline', value: '\n' },
];

const ast: AST = [
  {
    type: 'AssignmentExpr',
    return: DT.Void,
    expr1: helper.Var('foo', DT.Num),
    expr2: helper.NumberLiteral(123),
  },
  {
    type: 'AssignmentExpr',
    return: DT.Void,
    expr1: helper.Var('bar', DT.Str),
    expr2: helper.StringLiteral('Hello world'),
  },
  {
    type: 'AssignmentExpr',
    return: DT.Void,
    expr1: helper.Var('baz', DT.Bool),
    expr2: helper.BooleanLiteral(true),
  },
  {
    type: 'AssignmentExpr',
    return: DT.Void,
    expr1: helper.Var('nothing', DT.Null),
    expr2: helper.NullLiteral(),
  },
  {
    type: 'AssignmentExpr',
    return: DT.Void,
    expr1: helper.Var('list', DT.ListOf(DT.Num)),
    expr2: {
      type: 'ListLiteral',
      values: [
        helper.NumberLiteral(1),
        helper.NumberLiteral(2),
        helper.NumberLiteral(3),
        helper.NumberLiteral(4),
        helper.NumberLiteral(5),
      ],
      elementType: DT.Num,
      return: DT.ListOf(DT.Num),
    },
  },
];

const compiled = `\
const foo = 123;
const bar = 'Hello world';
const baz = true;
const nothing = null;
const list = [1, 2, 3, 4, 5];
`;

const minified = 'const foo=123;const bar=\'Hello world\';const baz=true;const nothing=null;const list=[1,2,3,4,5];';

export {
  tokens,
  ast,
  compiled,
  minified,
};
