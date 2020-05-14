import { Token, AST } from '../../types';
import { Var, NumberLiteral } from '../helper';
import DT from '../../parser/classes/DataType';

const program = `\
foo = 123 ## This is multiline comment
bar = 456
##
baz = 789
`;

const tokens: Array<Token> = [
  { type: 'ident', value: 'foo' },
  { type: 'eq', value: '=' },
  { type: 'number', value: '123' },
  // { type: 'comment', value: ' This is multiline comment\nbar = 456\n' },
  { type: 'newline', value: '\n' },

  { type: 'ident', value: 'baz' },
  { type: 'eq', value: '=' },
  { type: 'number', value: '789' },
  { type: 'newline', value: '\n' },
];

const ast: AST = [
  {
    type: 'AssignmentExpr',
    return: DT.Void,
    expr1: Var('foo', DT.Num),
    expr2: NumberLiteral(123),
  },
  {
    type: 'AssignmentExpr',
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
  program,
  tokens,
  ast,
  compiled,
  minified,
};
