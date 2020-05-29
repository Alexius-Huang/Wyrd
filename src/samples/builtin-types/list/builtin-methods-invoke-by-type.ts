import { Token, AST } from '../../../types';
import { DataType as DT } from '../../../parser/utils';
import { NumberLiteral, Var } from '../../helper';

const tokens: Array<Token> = [
  { type: 'ident', value: 'foo' },
  { type: 'eq', value: '=' },
  { type: 'lbracket', value: '[' },
  { type: 'number', value: '1' },
  { type: 'number', value: '2' },
  { type: 'number', value: '3' },
  { type: 'number', value: '4' },
  { type: 'number', value: '5' },
  { type: 'rbracket', value: ']' },
  { type: 'newline', value: '\n' },

  { type: 'ident', value: 'List' },
  { type: 'lt', value: '<' },
  { type: 'builtin-type', value: 'Num' },
  { type: 'gt', value: '>' },
  { type: 'dot', value: '.' },
  { type: 'ident', value: 'push' },
  { type: 'lparen', value: '(' },
  { type: 'ident', value: 'foo' },
  { type: 'comma', value: ',' },
  { type: 'number', value: '6' },
  { type: 'rparen', value: ')' },
  { type: 'newline', value: '\n' },

  { type: 'ident', value: 'List' },
  { type: 'lt', value: '<' },
  { type: 'builtin-type', value: 'Num' },
  { type: 'gt', value: '>' },
  { type: 'dot', value: '.' },
  { type: 'ident', value: 'concat' },
  { type: 'lparen', value: '(' },
  { type: 'ident', value: 'foo' },
  { type: 'comma', value: ',' },
  { type: 'lbracket', value: '[' },
  { type: 'number', value: '7' },
  { type: 'number', value: '8' },
  { type: 'number', value: '9' },
  { type: 'rbracket', value: ']' },
  { type: 'rparen', value: ')' },
  { type: 'newline', value: '\n' },
];

const ast: AST = [
  {
    type: 'AssignmentExpr',
    return: DT.Void,
    expr1: Var('foo', DT.ListOf(DT.Num)),
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
  {
    type: 'MethodInvokeExpr',
    name: 'push',
    receiver: Var('foo', DT.ListOf(DT.Num)),
    params: [
      NumberLiteral(6),
    ],
    return: DT.Num
  },
  {
    type: 'MethodInvokeExpr',
    name: 'concat',
    receiver: Var('foo', DT.ListOf(DT.Num)),
    params: [
      {
        type: 'ListLiteral',
        values: [
          NumberLiteral(7),
          NumberLiteral(8),
          NumberLiteral(9),
        ],
        elementType: DT.Num,
        return: DT.ListOf(DT.Num),
      }
    ],
    return: DT.ListOf(DT.Num),
  },
];

const compiled = `\
const foo = [1, 2, 3, 4, 5];
foo.push(6);
foo.concat([7, 8, 9]);
`;

const minified = 'const foo=[1,2,3,4,5];foo.push(6);foo.concat([7,8,9]);';

export {
  tokens,
  ast,
  compiled,
  minified,
};
