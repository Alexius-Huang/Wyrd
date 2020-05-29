import { Token, AST, Operator as Op } from '../../types';
import { NumberLiteral, Arithmetic } from '../helper';
import { DataType as DT } from '../../parser/utils';

const tokens: Array<Token> = [
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

  { type: 'keyword', value: 'override' },
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
  { type: 'plus', value: '+' },
  { type: 'number', value: '1' },
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
];

const ast: AST = [
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
    type: 'MethodDeclaration',
    receiverType: DT.Num,
    name: 'Num_add$1',
    return: DT.Void,
    arguments: [
      { ident: 'x', type: DT.Num },
    ],
    outputType: DT.Num,
    body: [
      {
        type: 'BinaryOpExpr',
        return: DT.Num,
        operator: Op.Plus,
        expr1: Arithmetic('this', '+', 'x'),
        expr2: NumberLiteral(1),
      },
    ],
  },
  {
    type: 'MethodInvokeExpr',
    name: 'Num_add$1',
    receiver: NumberLiteral(123),
    params: [
      NumberLiteral(456),
    ],
    return: DT.Num,
    isNotBuiltin: true,
  },
  {
    type: 'MethodInvokeExpr',
    name: 'Num_add$1',
    receiver: NumberLiteral(123),
    params: [
      NumberLiteral(456),
    ],
    return: DT.Num,
    isNotBuiltin: true,
  },
];

const compiled = `\
function Num_add(_this, x) {
  return _this + x;
}

Num_add(123, 456);
Num_add(123, 456);
function Num_add$1(_this, x) {
  return _this + x + 1;
}

Num_add$1(123, 456);
Num_add$1(123, 456);
`;

const minified = 'function Num_add(_this,x){return _this+x;}Num_add(123,456);Num_add(123,456);function Num_add$1(_this,x){return _this+x+1;}Num_add$1(123,456);Num_add$1(123,456);';

export {
  tokens,
  ast,
  compiled,
  minified,
};
