import { Token, AST, Operator as Op } from '../../types';
import { NumberLiteral, Arithmetic, Var } from '../helper';
import { DataType as DT } from '../../parser/utils';

const program = `\
import "./example.wyrd"

foo = addition(123, 456)
`;

const tokens: Array<Token> = [
  { type: 'keyword', value: 'import' },
  { type: 'string', value: './example.wyrd' },
  { type: 'newline', value: '\n' },
  { type: 'newline', value: '\n' },

  { type: 'ident', value: 'foo' },
  { type: 'eq', value: '=' },
  { type: 'ident', value: 'addition' },
  { type: 'lparen', value: '(' },
  { type: 'number', value: '123' },
  { type: 'comma', value: ',' },
  { type: 'number', value: '456' },
  { type: 'rparen', value: ')' },
  { type: 'newline', value: '\n' },
];

const ast: AST = [
  {
    type: 'FunctionDeclaration',
    name: 'addition',
    outputType: DT.Num,
    return: DT.Void,
    arguments: [
      { ident: 'x', type: DT.Num },
      { ident: 'y', type: DT.Num },
    ],
    body: [
      Arithmetic('x', '+', 'y'),
    ],
  },
  {
    type: 'AssignmentExpr',
    return: DT.Void,
    expr1: Var('foo', DT.Num),
    expr2: {
      type: 'FunctionInvokeExpr', 
      name: 'addition',
      return: DT.Num,
      params: [
        NumberLiteral(123),
        NumberLiteral(456),
      ]
    }
  }
];

const compiled = `\
function addition(x, y) {
  return x + y;
}

const foo = addition(123, 456);
`;

const minified = '';

export {
  program,
  tokens,
  ast,
  compiled,
  minified,
};
