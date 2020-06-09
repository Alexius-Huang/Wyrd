import { Token, AST } from '../../types';
import { Var, NumberLiteral } from '../helper';
import { DataType as DT } from '../../parser/utils';

const tokens: Array<Token> = [
  { type: 'builtin-type', value: 'Num' },
  { type: 'ident', value: 'foo' },
  { type: 'eq', value: '=' },
  { type: 'number', value: '123' },
  // { type: 'comment', value: ' This is comment' },
  { type: 'newline', value: '\n' },

  // { type: 'comment', value: ' Num bar = 456' },
  { type: 'newline', value: '\n' },

  { type: 'builtin-type', value: 'Num' },
  { type: 'ident', value: 'baz' },
  { type: 'eq', value: '=' },
  { type: 'number', value: '789' },
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
    expr1: Var('baz', DT.Num),
    expr2: NumberLiteral(789),
  },
];

const compiled = `\
const foo = 123;
const baz = 789;
`;

const minified = 'const foo=123;const baz=789;';

export {
  tokens,
  ast,
  compiled,
  minified,
};
