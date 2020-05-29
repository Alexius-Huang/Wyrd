import { Token, AST, CompilerOptions } from '../../types';
import { NumberLiteral, Var } from '../helper';
import { DataType as DT } from '../../parser/utils';

const tokens: Array<Token> = [
  { type: 'keyword', value: 'import' },
  { type: 'string', value: './example.wyrd' },
  { type: 'newline', value: '\n' },
  { type: 'keyword', value: 'import' },
  { type: 'string', value: './example2.wyrd' },
  { type: 'newline', value: '\n' },
  { type: 'keyword', value: 'import' },
  { type: 'string', value: './folder/example3.wyrd' },
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
  { type: 'ident', value: 'addition' },
  { type: 'lparen', value: '(' },
  { type: 'number', value: '123' },
  { type: 'comma', value: ',' },
  { type: 'number', value: '456' },
  { type: 'comma', value: ',' },
  { type: 'ident', value: 'foo' },
  { type: 'dot', value: '.' },
  { type: 'ident', value: 'add' },
  { type: 'lparen', value: '(' },
  { type: 'number', value: '789' },
  { type: 'rparen', value: ')' },
  { type: 'rparen', value: ')' },
  { type: 'newline', value: '\n' },
];

const ast: AST = [
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
      ],
    },
  },
  {
    type: 'FunctionInvokeExpr',
    return: DT.Num,
    name: 'addition_1',
    params: [
      NumberLiteral(123),
      NumberLiteral(456),
      {
        type: 'MethodInvokeExpr',
        return: DT.Num,
        name: 'Num_add',
        isNotBuiltin: true,
        receiver: Var('foo', DT.Num),
        params: [
          NumberLiteral(789),
        ],
      },
    ],
  },
];

const compiled = `\
const foo = addition(123, 456);
addition_1(123, 456, Num_add(foo, 789));
`;

const minified = '';

const compilerOptions: CompilerOptions = {
  mainFileOnly: true,
};

export {
  tokens,
  ast,
  compiled,
  minified,
  compilerOptions,
};
