import { Token, AST, Operator as Op } from '../../types';
import { NumberLiteral, Arithmetic } from '../helper';
import { DataType as DT } from '../../parser/utils';

const tokens: Array<Token> = [
  { type: 'keyword', value: 'def' },
  { type: 'builtin-type', value: 'Num' },
  { type: 'dot', value: '.' },
  { type: 'ident', value: 'isPositive' },
  { type: 'colon', value: ':' },
  { type: 'builtin-type', value: 'Bool' },
  { type: 'arrow', value: '=>' },
  { type: 'keyword', value: 'this' },
  { type: 'gt', value: '>' },
  { type: 'number', value: '0' },
  { type: 'newline', value: '\n' },

  { type: 'number', value: '123' },
  { type: 'dot', value: '.' },
  { type: 'ident', value: 'isPositive' },
  { type: 'lparen', value: '(' },
  { type: 'rparen', value: ')' },
  { type: 'newline', value: '\n' },

  { type: 'builtin-type', value: 'Num' },
  { type: 'dot', value: '.' },
  { type: 'ident', value: 'isPositive' },
  { type: 'lparen', value: '(' },
  { type: 'number', value: '123' },
  { type: 'rparen', value: ')' },
  { type: 'newline', value: '\n' },
  { type: 'newline', value: '\n' },

  { type: 'keyword', value: 'def' },
  { type: 'builtin-type', value: 'Num' },
  { type: 'dot', value: '.' },
  { type: 'ident', value: 'add' },
  { type: 'lparen', value: '(' },
  { type: 'ident', value: 'x' },
  { type: 'colon', value: ':' },
  { type: 'builtin-type', value: 'Num' },
  { type: 'rparen', value: ')' },
  { type: 'colon', value: ':' },
  { type: 'builtin-type', value: 'Num' },
  { type: 'arrow', value: '=>' },
  { type: 'keyword', value: 'this' },
  { type: 'plus', value: '+' },
  { type: 'ident', value: 'x' },
  { type: 'newline', value: '\n' },

  { type: 'number', value: '123' },
  { type: 'dot', value: '.' },
  { type: 'ident', value: 'add' },
  { type: 'lparen', value: '(' },
  { type: 'number', value: '456' },
  { type: 'rparen', value: ')' },
  { type: 'newline', value: '\n' },

  { type: 'builtin-type', value: 'Num' },
  { type: 'dot', value: '.' },
  { type: 'ident', value: 'add' },
  { type: 'lparen', value: '(' },
  { type: 'number', value: '123' },
  { type: 'comma', value: ',' },
  { type: 'number', value: '456' },
  { type: 'rparen', value: ')' },
  { type: 'newline', value: '\n' },
  { type: 'newline', value: '\n' },

  { type: 'number', value: '123' },
  { type: 'dot', value: '.' },
  { type: 'ident', value: 'add' },
  { type: 'lparen', value: '(' },
  { type: 'number', value: '456' },
  { type: 'rparen', value: ')' },
  { type: 'dot', value: '.' },
  { type: 'ident', value: 'isPositive' },
  { type: 'lparen', value: '(' },
  { type: 'rparen', value: ')' },
  { type: 'newline', value: '\n' },

  { type: 'builtin-type', value: 'Num' },
  { type: 'dot', value: '.' },
  { type: 'ident', value: 'add' },
  { type: 'lparen', value: '(' },
  { type: 'number', value: '123' },
  { type: 'comma', value: ',' },
  { type: 'number', value: '456' },
  { type: 'rparen', value: ')' },
  { type: 'dot', value: '.' },
  { type: 'ident', value: 'isPositive' },
  { type: 'lparen', value: '(' },
  { type: 'rparen', value: ')' },
  { type: 'newline', value: '\n' },

  { type: 'builtin-type', value: 'Num' },
  { type: 'dot', value: '.' },
  { type: 'ident', value: 'isPositive' },
  { type: 'lparen', value: '(' },
  { type: 'number', value: '123' },
  { type: 'dot', value: '.' },
  { type: 'ident', value: 'add' },
  { type: 'lparen', value: '(' },
  { type: 'number', value: '456' },
  { type: 'rparen', value: ')' },
  { type: 'rparen', value: ')' },
  { type: 'newline', value: '\n' },

  { type: 'builtin-type', value: 'Num' },
  { type: 'dot', value: '.' },
  { type: 'ident', value: 'isPositive' },
  { type: 'lparen', value: '(' },
  { type: 'builtin-type', value: 'Num' },
  { type: 'dot', value: '.' },
  { type: 'ident', value: 'add' },
  { type: 'lparen', value: '(' },
  { type: 'number', value: '123' },
  { type: 'comma', value: ',' },
  { type: 'number', value: '456' },
  { type: 'rparen', value: ')' },
  { type: 'rparen', value: ')' },
  { type: 'newline', value: '\n' },
];

const ast: AST = [
  {
    type: 'MethodDeclaration',
    receiverType: DT.Num,
    name: 'Num_isPositive',
    return: DT.Void,
    arguments: [],
    outputType: DT.Bool,
    body: [
      {
        type: 'BinaryOpExpr',
        operator: Op.Gt,
        return: DT.Bool,
        expr1: { type: 'ThisLiteral', return: DT.Num },
        expr2: NumberLiteral(0),
      },
    ],
  },
  {
    type: 'MethodInvokeExpr',
    name: 'Num_isPositive',
    receiver: NumberLiteral(123),
    params: [],
    return: DT.Bool,
    isNotBuiltin: true,
  },
  {
    type: 'MethodInvokeExpr',
    name: 'Num_isPositive',
    receiver: NumberLiteral(123),
    params: [],
    return: DT.Bool,
    isNotBuiltin: true,
  },
  {
    type: 'MethodDeclaration',
    receiverType: DT.Num,
    name: 'Num_add',
    return: DT.Void,
    arguments: [
      { ident: 'x', type: DT.Num }
    ],
    outputType: DT.Num,
    body: [
      Arithmetic('this', '+', 'x')
    ],
  },
  {
    type: 'MethodInvokeExpr',
    name: 'Num_add',
    receiver: NumberLiteral(123),
    params: [
      NumberLiteral(456),
    ],
    return: DT.Num,
    isNotBuiltin: true,
  },
  {
    type: 'MethodInvokeExpr',
    name: 'Num_add',
    receiver: NumberLiteral(123),
    params: [
      NumberLiteral(456),
    ],
    return: DT.Num,
    isNotBuiltin: true,
  },
  {
    type: 'MethodInvokeExpr',
    name: 'Num_isPositive',
    receiver: {
      type: 'MethodInvokeExpr',
      name: 'Num_add',
      receiver: NumberLiteral(123),
      params: [
        NumberLiteral(456),
      ],
      return: DT.Num,
      isNotBuiltin: true,
    },
    params: [],
    return: DT.Bool,
    isNotBuiltin: true,
  },
  {
    type: 'MethodInvokeExpr',
    name: 'Num_isPositive',
    receiver: {
      type: 'MethodInvokeExpr',
      name: 'Num_add',
      receiver: NumberLiteral(123),
      params: [
        NumberLiteral(456),
      ],
      return: DT.Num,
      isNotBuiltin: true,
    },
    params: [],
    return: DT.Bool,
    isNotBuiltin: true,
  },
  {
    type: 'MethodInvokeExpr',
    name: 'Num_isPositive',
    receiver: {
      type: 'MethodInvokeExpr',
      name: 'Num_add',
      receiver: NumberLiteral(123),
      params: [
        NumberLiteral(456),
      ],
      return: DT.Num,
      isNotBuiltin: true,
    },
    params: [],
    return: DT.Bool,
    isNotBuiltin: true,
  },
  {
    type: 'MethodInvokeExpr',
    name: 'Num_isPositive',
    receiver: {
      type: 'MethodInvokeExpr',
      name: 'Num_add',
      receiver: NumberLiteral(123),
      params: [
        NumberLiteral(456),
      ],
      return: DT.Num,
      isNotBuiltin: true,
    },
    params: [],
    return: DT.Bool,
    isNotBuiltin: true,
  },
];

const compiled = `\
function Num_isPositive(_this) {
  return _this > 0;
}

Num_isPositive(123);
Num_isPositive(123);
function Num_add(_this, x) {
  return _this + x;
}

Num_add(123, 456);
Num_add(123, 456);
Num_isPositive(Num_add(123, 456));
Num_isPositive(Num_add(123, 456));
Num_isPositive(Num_add(123, 456));
Num_isPositive(Num_add(123, 456));
`;

const minified = 'function Num_isPositive(_this){return _this>0;}Num_isPositive(123);Num_isPositive(123);function Num_add(_this,x){return _this+x;}Num_add(123,456);Num_add(123,456);Num_isPositive(Num_add(123,456));Num_isPositive(Num_add(123,456));Num_isPositive(Num_add(123,456));Num_isPositive(Num_add(123,456));';

export {
  tokens,
  ast,
  compiled,
  minified,
};
