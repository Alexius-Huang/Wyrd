import { Token, AST } from '../../types';
import { StringLiteral, Var } from '../helper';
import { DataType as DT } from '../../parser/utils';

const tokens: Array<Token> = [
  { type: 'ident', value: 'foo' },
  { type: 'eq', value: '=' },
  { type: 'string', value: 'hello world' },
  { type: 'pipe-op', value: '|>' },
  { type: 'builtin-type', value: 'Str' },
  { type: 'dot', value: '.' },
  { type: 'ident', value: 'upcase' },
  { type: 'lparen', value: '(' },
  { type: 'rparen', value: ')' },
  { type: 'pipe-op', value: '|>' },
  { type: 'builtin-type', value: 'Str' },
  { type: 'dot', value: '.' },
  { type: 'ident', value: 'split' },
  { type: 'lparen', value: '(' },
  { type: 'string', value: ' ' },
  { type: 'rparen', value: ')' },
  { type: 'newline', value: '\n' },
];

const ast: AST = [
  {
    type: 'AssignmentExpr',
    return: DT.Void,
    expr1: Var('foo', DT.ListOf(DT.Str)),
    expr2: {
      type: 'MethodInvokeExpr',
      receiver: {
        type: 'MethodInvokeExpr',
        receiver: StringLiteral('hello world'),
        name: 'toUpperCase',
        params: [],
        return: DT.Str,
        isNotBuiltin: false,
      },
      name: 'split',
      params: [
        StringLiteral(' '),
      ],
      return: DT.ListOf(DT.Str),
      isNotBuiltin: false,
    },
  },
];

const compiled = `\
const foo = ('hello world').toUpperCase().split(' ');
`;

const minified = 'const foo=(\'hello world\').toUpperCase().split(\' \');';

export {
  tokens,
  ast,
  compiled,
  minified,
};
