import { Token, AST, Operator as Op } from '../../types';
import { NumberLiteral, Arithmetic, Var } from '../helper';
import { DataType as DT } from '../../parser/utils';

const program = `\
mutable foo maybe Num = 123
foo = 456
foo = 1 * 2 - 3 / 4

`;

const tokens: Array<Token> = [
  { type: 'keyword', value: 'mutable' },
  { type: 'ident', value: 'foo' },
  { type: 'keyword', value: 'maybe' },
  { type: 'builtin-type', value: 'Num' },
  { type: 'eq', value: '=' },
  { type: 'number', value: '123' },
  { type: 'newline', value: '\n' },

  { type: 'ident', value: 'foo' },
  { type: 'eq', value: '=' },
  { type: 'number', value: '456' },
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
];

const ast: AST = [
  {
    type: 'VarDeclaration',
    return: DT.Void,
    expr1: Var('foo', DT.Maybe.Num),
    expr2: NumberLiteral(123),
  },
  {
    type: 'VarAssignmentExpr',
    return: DT.Void,
    expr1: Var('foo', DT.Maybe.Num),
    expr2: NumberLiteral(456),
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
];

const compiled = `\
let foo = 123;
foo = 456;
foo = 1 * 2 - (3 / 4);
`;

const minified = '';

export {
  program,
  tokens,
  ast,
  compiled,
  minified,
};
