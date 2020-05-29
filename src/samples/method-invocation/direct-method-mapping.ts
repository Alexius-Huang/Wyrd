import { Token, AST } from '../../types';
import { StringLiteral, NumberLiteral } from '../helper';
import { DataType as DT } from '../../parser/utils';

const tokens: Array<Token> = [
  { type: 'string', value: 'Hello world' },
  { type: 'dot', value: '.' },
  { type: 'ident', value: 'upcase' },
  { type: 'lparen', value: '(' },
  { type: 'rparen', value: ')' },
  { type: 'newline', value: '\n' },

  { type: 'string', value: 'Hello world' },
  { type: 'dot', value: '.' },
  { type: 'ident', value: 'repeat' },
  { type: 'lparen', value: '(' },
  { type: 'number', value: '3' },
  { type: 'rparen', value: ')' },
  { type: 'newline', value: '\n' },
];

const ast: AST = [
  {
    type: 'MethodInvokeExpr',
    name: 'toUpperCase',
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
  tokens,
  ast,
  compiled,
  minified,
};
