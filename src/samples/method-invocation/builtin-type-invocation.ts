import { Token, AST } from '../../types';
import { StringLiteral, NumberLiteral } from '../helper';
import DT from '../../parser/classes/DataType';

const program = `\
Str.upcase("Hello world")
Str.repeat("Hello world", 3)
`;

const tokens: Array<Token> = [
  { type: 'builtin-type', value: 'Str' },
  { type: 'dot', value: '.' },
  { type: 'ident', value: 'upcase' },
  { type: 'lparen', value: '(' },
  { type: 'string', value: 'Hello world' },
  { type: 'rparen', value: ')' },
  { type: 'newline', value: '\n' },

  { type: 'builtin-type', value: 'Str' },
  { type: 'dot', value: '.' },
  { type: 'ident', value: 'repeat' },
  { type: 'lparen', value: '(' },
  { type: 'string', value: 'Hello world' },
  { type: 'comma', value: ',' },
  { type: 'number', value: '3' },
  { type: 'rparen', value: ')' },
  { type: 'newline', value: '\n' },
];

const ast: AST = [
  {
    type: 'MethodInvokeExpr',
    name: 'upcase',
    receiver: StringLiteral('Hello world'),
    params: [],
    return: DT.Str,
  },
  {
    type: 'MethodInvokeExpr',
    name: 'repeat',
    receiver: StringLiteral('Hello world'),
    params: [
      NumberLiteral(3),
    ],
    return: DT.Str,
  },
];

const compiled = `\
('Hello world').toUpperCase();
('Hello world').repeat(3);
`;

const minified = '(\'Hello world\').toUpperCase();(\'Hello world\').repeat(3);';

export {
  program,
  tokens,
  ast,
  compiled,
  minified,
};
