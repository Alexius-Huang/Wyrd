import { Token, AST, Operator as Op } from '../../types';
import { NumberLiteral, Arithmetic } from '../helper';
import { DataType as DT } from '../../parser/utils';

const tokens: Array<Token> = [
  { type: 'keyword', value: 'def' },
  { type: 'ident', value: 'addition' },
  { type: 'lparen', value: '(' },
  { type: 'ident', value: 'x' },
  { type: 'colon', value: ':' },
  { type: 'builtin-type', value: 'Num' },
  { type: 'comma', value: ',' },
  { type: 'ident', value: 'y' },
  { type: 'colon', value: ':' },
  { type: 'builtin-type', value: 'Num' },
  { type: 'rparen', value: ')' },
  { type: 'colon', value: ':' },
  { type: 'builtin-type', value: 'Num' },
  { type: 'arrow', value: '=>' },
  { type: 'ident', value: 'x' },
  { type: 'plus', value: '+' },
  { type: 'ident', value: 'y' },
  { type: 'newline', value: '\n' },

  { type: 'keyword', value: 'def' },
  { type: 'ident', value: 'addition' },
  { type: 'lparen', value: '(' },
  { type: 'ident', value: 'x' },
  { type: 'colon', value: ':' },
  { type: 'builtin-type', value: 'Num' },
  { type: 'comma', value: ',' },
  { type: 'ident', value: 'y' },
  { type: 'colon', value: ':' },
  { type: 'builtin-type', value: 'Num' },
  { type: 'comma', value: ',' },
  { type: 'ident', value: 'z' },
  { type: 'colon', value: ':' },
  { type: 'builtin-type', value: 'Num' },
  { type: 'rparen', value: ')' },
  { type: 'colon', value: ':' },
  { type: 'builtin-type', value: 'Num' },
  { type: 'arrow', value: '=>' },
  { type: 'ident', value: 'x' },
  { type: 'plus', value: '+' },
  { type: 'ident', value: 'y' },
  { type: 'plus', value: '+' },
  { type: 'ident', value: 'z' },
  { type: 'newline', value: '\n' },

  { type: 'keyword', value: 'def' },
  { type: 'ident', value: 'addition' },
  { type: 'lparen', value: '(' },
  { type: 'ident', value: 'w' },
  { type: 'colon', value: ':' },
  { type: 'builtin-type', value: 'Num' },
  { type: 'comma', value: ',' },
  { type: 'ident', value: 'x' },
  { type: 'colon', value: ':' },
  { type: 'builtin-type', value: 'Num' },
  { type: 'comma', value: ',' },
  { type: 'ident', value: 'y' },
  { type: 'colon', value: ':' },
  { type: 'builtin-type', value: 'Num' },
  { type: 'comma', value: ',' },
  { type: 'ident', value: 'z' },
  { type: 'colon', value: ':' },
  { type: 'builtin-type', value: 'Num' },
  { type: 'rparen', value: ')' },
  { type: 'colon', value: ':' },
  { type: 'builtin-type', value: 'Num' },
  { type: 'arrow', value: '=>' },
  { type: 'ident', value: 'w' },
  { type: 'plus', value: '+' },
  { type: 'ident', value: 'x' },
  { type: 'plus', value: '+' },
  { type: 'ident', value: 'y' },
  { type: 'plus', value: '+' },
  { type: 'ident', value: 'z' },
  { type: 'newline', value: '\n' },
  { type: 'newline', value: '\n' },

  { type: 'ident', value: 'addition' },
  { type: 'lparen', value: '(' },
  { type: 'number', value: '1' },
  { type: 'comma', value: ',' },
  { type: 'number', value: '2' },
  { type: 'rparen', value: ')' },
  { type: 'newline', value: '\n' },

  { type: 'ident', value: 'addition' },
  { type: 'lparen', value: '(' },
  { type: 'number', value: '1' },
  { type: 'comma', value: ',' },
  { type: 'number', value: '2' },
  { type: 'comma', value: ',' },
  { type: 'number', value: '3' },
  { type: 'rparen', value: ')' },
  { type: 'newline', value: '\n' },

  { type: 'ident', value: 'addition' },
  { type: 'lparen', value: '(' },
  { type: 'number', value: '1' },
  { type: 'comma', value: ',' },
  { type: 'number', value: '2' },
  { type: 'comma', value: ',' },
  { type: 'number', value: '3' },
  { type: 'comma', value: ',' },
  { type: 'number', value: '4' },
  { type: 'rparen', value: ')' },
  { type: 'newline', value: '\n' },
];

const ast: AST = [
  {
    type: 'FunctionDeclaration',
    name: 'addition',
    return: DT.Void,
    arguments: [
      { ident: 'x', type: DT.Num },
      { ident: 'y', type: DT.Num }
    ],
    outputType: DT.Num,
    body: [
      Arithmetic('x', '+', 'y'),
    ],
  },
  {
    type: 'FunctionDeclaration',
    name: 'addition_1',
    return: DT.Void,
    arguments: [
      { ident: 'x', type: DT.Num },
      { ident: 'y', type: DT.Num },
      { ident: 'z', type: DT.Num }
    ],
    outputType: DT.Num,
    body: [
      {
        type: 'BinaryOpExpr',
        operator: Op.Plus,
        return: DT.Num,
        expr1: Arithmetic('x', '+', 'y'),
        expr2: { type: 'IdentLiteral', value: 'z', return: DT.Num },
      },
    ],
  },
  {
    type: 'FunctionDeclaration',
    name: 'addition_2',
    return: DT.Void,
    arguments: [
      { ident: 'w', type: DT.Num },
      { ident: 'x', type: DT.Num },
      { ident: 'y', type: DT.Num },
      { ident: 'z', type: DT.Num }
    ],
    outputType: DT.Num,
    body: [
      {
        type: 'BinaryOpExpr',
        operator: Op.Plus,
        return: DT.Num,
        expr1: {
          type: 'BinaryOpExpr',
          operator: Op.Plus,
          return: DT.Num,
          expr1: Arithmetic('w', '+', 'x'),
          expr2: { type: 'IdentLiteral', value: 'y', return: DT.Num }
        },
        expr2: { type: 'IdentLiteral', value: 'z', return: DT.Num }
      },
    ],
  },
  {
    type: 'FunctionInvokeExpr',
    name: 'addition',
    params: [
      NumberLiteral(1),
      NumberLiteral(2)
    ],
    return: DT.Num,
  },
  {
    type: 'FunctionInvokeExpr',
    name: 'addition_1',
    params: [
      NumberLiteral(1),
      NumberLiteral(2),
      NumberLiteral(3)
    ],
    return: DT.Num,
  },
  {
    type: 'FunctionInvokeExpr',
    name: 'addition_2',
    params: [
      NumberLiteral(1),
      NumberLiteral(2),
      NumberLiteral(3),
      NumberLiteral(4)
    ],
    return: DT.Num,
  },
];

const compiled = `\
function addition(x, y) {
  return x + y;
}

function addition_1(x, y, z) {
  return x + y + z;
}

function addition_2(w, x, y, z) {
  return w + x + y + z;
}

addition(1, 2);
addition_1(1, 2, 3);
addition_2(1, 2, 3, 4);
`;

const minified = 'function addition(x,y){return x+y;}function addition_1(x,y,z){return x+y+z;}function addition_2(w,x,y,z){return w+x+y+z;}addition(1,2);addition_1(1,2,3);addition_2(1,2,3,4);';

export {
  tokens,
  ast,
  compiled,
  minified,
};
