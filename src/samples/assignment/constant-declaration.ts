import { Token, AST } from '../../types';
import { DataType as DT } from '../../parser/utils';
import { Var, NumberLiteral, StringLiteral, BooleanLiteral, NullLiteral } from '../helper';

const tokens: Array<Token> = [
  { type: 'builtin-type', value: 'Num' },
  { type: 'ident', value: 'foo' },
  { type: 'eq', value: '=' },
  { type: 'number', value: '123' },
  { type: 'newline', value: '\n' },

  { type: 'builtin-type', value: 'Str' },
  { type: 'ident', value: 'bar' },
  { type: 'eq', value: '=' },
  { type: 'string', value: 'Hello world' },
  { type: 'newline', value: '\n' },

  { type: 'builtin-type', value: 'Bool' },
  { type: 'ident', value: 'baz' },
  { type: 'eq', value: '=' },
  { type: 'boolean', value: 'True' },
  { type: 'newline', value: '\n' },

  { type: 'null', value: 'Null' },
  { type: 'ident', value: 'nothing' },
  { type: 'eq', value: '=' },
  { type: 'null', value: 'Null' },
  { type: 'newline', value: '\n' },

  { type: 'ident', value: 'List' },
  { type: 'lt', value: '<' },
  { type: 'builtin-type', value: 'Num' },
  { type: 'gt', value: '>' },
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
    type: 'ConstDeclaration',
    return: DT.Void,
    expr1: Var('foo', DT.Num),
    expr2: NumberLiteral(123),
  },
  {
    type: 'ConstDeclaration',
    return: DT.Void,
    expr1: Var('bar', DT.Str),
    expr2: StringLiteral('Hello world'),
  },
  {
    type: 'ConstDeclaration',
    return: DT.Void,
    expr1: Var('baz', DT.Bool),
    expr2: BooleanLiteral(true),
  },
  {
    type: 'ConstDeclaration',
    return: DT.Void,
    expr1: Var('nothing', DT.Null),
    expr2: NullLiteral(),
  },
  {
    type: 'ConstDeclaration',
    return: DT.Void,
    expr1: Var('list', DT.ListOf(DT.Num)),
    expr2: {
      type: 'ListLiteral',
      values: [
        NumberLiteral(1),
        NumberLiteral(2),
        NumberLiteral(3),
        NumberLiteral(4),
        NumberLiteral(5),
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

const minified = '';// 'const foo=123;const bar=\'Hello world\';const baz=true;const nothing=null;const list=[1,2,3,4,5];';

export {
  tokens,
  ast,
  compiled,
  minified,
};
