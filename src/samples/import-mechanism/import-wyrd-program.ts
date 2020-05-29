import { Token, AST, Operator as Op } from '../../types';
import { NumberLiteral, Arithmetic, Var } from '../helper';
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
    type: 'MethodDeclaration',
    name: 'Num_add',
    outputType: DT.Num,
    return: DT.Void,
    receiverType: DT.Num,
    arguments: [
      { ident: 'y', type: DT.Num },
    ],
    body: [
      Arithmetic('this', '+', 'y')
    ],
  },
  {
    type: 'MethodDeclaration',
    name: 'Num_add_1',
    outputType: DT.Num,
    return: DT.Void,
    receiverType: DT.Num,
    arguments: [
      { ident: 'y', type: DT.Num },
      { ident: 'z', type: DT.Num },
    ],
    body: [
      {
        type: 'BinaryOpExpr',
        operator: Op.Plus,
        return: DT.Num,
        expr1: Arithmetic('this', '+', 'y'),
        expr2: Var('z', DT.Num),
      }
    ],
  },
  {
    type: 'FunctionDeclaration',
    name: 'addition_1',
    outputType: DT.Num,
    return: DT.Void,
    arguments: [
      { ident: 'x', type: DT.Num },
      { ident: 'y', type: DT.Num },
      { ident: 'z', type: DT.Num },
    ],
    body: [
      {
        type: 'BinaryOpExpr',
        operator: Op.Plus,
        return: DT.Num,
        expr1: Arithmetic('x', '+', 'y'),
        expr2: Var('z', DT.Num),
      },
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
function addition(x, y) {
  return x + y;
}

function Num_add(_this, y) {
  return _this + y;
}

function Num_add_1(_this, y, z) {
  return _this + y + z;
}

function addition_1(x, y, z) {
  return x + y + z;
}

const foo = addition(123, 456);
addition_1(123, 456, Num_add(foo, 789));
`;

const minified = '';

export {
  tokens,
  ast,
  compiled,
  minified,
};
