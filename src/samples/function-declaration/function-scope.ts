import { Token, AST } from '../../types';
import { NumberLiteral, Var, Arithmetic } from '../helper';
import { DataType as DT } from '../../parser/utils';

const tokens: Array<Token> = [
  { type: 'builtin-type', value: 'Num' },
  { type: 'ident', value: 'foo' },
  { type: 'eq', value: '=' },
  { type: 'number', value: '123' },
  { type: 'newline', value: '\n' },

  { type: 'keyword', value: 'mutable' },
  { type: 'builtin-type', value: 'Num' },
  { type: 'ident', value: 'bar' },
  { type: 'eq', value: '=' },
  { type: 'number', value: '456' },
  { type: 'newline', value: '\n' },
  { type: 'newline', value: '\n' },

  { type: 'keyword', value: 'def' },
  { type: 'ident', value: 'varInsideFunction' },
  { type: 'colon', value: ':' },
  { type: 'builtin-type', value: 'Num' },
  { type: 'keyword', value: 'do' },
  { type: 'newline', value: '\n' },

  { type: 'builtin-type', value: 'Num' },
  { type: 'ident', value: 'foo' },
  { type: 'eq', value: '=' },
  { type: 'number', value: '456' },
  { type: 'newline', value: '\n' },
  { type: 'keyword', value: 'mutable' },
  { type: 'builtin-type', value: 'Num' },
  { type: 'ident', value: 'bar' },
  { type: 'eq', value: '=' },
  { type: 'number', value: '789' },
  { type: 'newline', value: '\n' },
  { type: 'ident', value: 'foo' },
  { type: 'plus', value: '+' },
  { type: 'ident', value: 'bar' },
  { type: 'newline', value: '\n' },
  { type: 'keyword', value: 'end' },
  { type: 'newline', value: '\n' },
  { type: 'newline', value: '\n' },

  { type: 'ident', value: 'varInsideFunction' },
  { type: 'lparen', value: '(' },
  { type: 'rparen', value: ')' },
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
    type: 'VarDeclaration',
    return: DT.Void,
    expr1: Var('bar', DT.Num),
    expr2: NumberLiteral(456),
  },
  {
    type: 'FunctionDeclaration',
    name: 'varInsideFunction',
    return: DT.Void,
    arguments: [],
    outputType: DT.Num,
    body: [
      {
        type: 'ConstDeclaration',
        return: DT.Void,
        expr1: Var('foo', DT.Num),
        expr2: NumberLiteral(456),
      },
      {
        type: 'VarDeclaration',
        return: DT.Void,
        expr1: Var('bar', DT.Num),
        expr2: NumberLiteral(789),
      },
      Arithmetic('foo', '+', 'bar'),
    ],
  },
  {
    type: 'FunctionInvokeExpr',
    name: 'varInsideFunction',
    return: DT.Num,
    params: [],
  }
];

const compiled = `\
const foo = 123;
let bar = 456;
function varInsideFunction() {
  const foo = 456;
  let bar = 789;
  return foo + bar;
}

varInsideFunction();
`;

const minified = '';

export {
  tokens,
  ast,
  compiled,
  minified,
};
