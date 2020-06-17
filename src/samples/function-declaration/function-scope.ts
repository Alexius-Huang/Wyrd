import { Token, AST } from '../../types';
import { NumberLiteral, Var } from '../helper';
import { DataType as DT } from '../../parser/utils';

const tokens: Array<Token> = [
  { type: 'builtin-type', value: 'Num' },
  { type: 'ident', value: 'foo' },
  { type: 'eq', value: '=' },
  { type: 'number', value: '123' },
  { type: 'newline', value: '\n' },
  { type: 'newline', value: '\n' },

  { type: 'keyword', value: 'def' },
  { type: 'ident', value: 'fooInsideFunction' },
  { type: 'colon', value: ':' },
  { type: 'builtin-type', value: 'Num' },
  { type: 'keyword', value: 'do' },
  { type: 'newline', value: '\n' },

  { type: 'builtin-type', value: 'Num' },
  { type: 'ident', value: 'foo' },
  { type: 'eq', value: '=' },
  { type: 'number', value: '456' },
  { type: 'newline', value: '\n' },
  { type: 'ident', value: 'foo' },
  { type: 'newline', value: '\n' },
  { type: 'keyword', value: 'end' },
  { type: 'newline', value: '\n' },
  { type: 'newline', value: '\n' },

  { type: 'ident', value: 'fooInsideFunction' },
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
    type: 'FunctionDeclaration',
    name: 'fooInsideFunction',
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
      Var('foo', DT.Num),
    ],
  },
  {
    type: 'FunctionInvokeExpr',
    name: 'fooInsideFunction',
    return: DT.Num,
    params: [],
  }
];

const compiled = `\
const foo = 123;
function fooInsideFunction() {
  const foo = 456;
  return foo;
}

fooInsideFunction();
`;

const minified = '';

export {
  tokens,
  ast,
  compiled,
  minified,
};
