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
  { type: 'newline', value: '\n' },

  { type: 'keyword', value: 'override' },
  { type: 'keyword', value: 'def' },
  { type: 'ident', value: 'addition' },
  { type: 'lparen', value: '(' },
  { type: 'ident', value: 'a' },
  { type: 'colon', value: ':' },
  { type: 'builtin-type', value: 'Num' },
  { type: 'comma', value: ',' },
  { type: 'ident', value: 'b' },
  { type: 'colon', value: ':' },
  { type: 'builtin-type', value: 'Num' },
  { type: 'comma', value: ',' },
  { type: 'ident', value: 'c' },
  { type: 'colon', value: ':' },
  { type: 'builtin-type', value: 'Num' },
  { type: 'comma', value: ',' },
  { type: 'ident', value: 'd' },
  { type: 'colon', value: ':' },
  { type: 'builtin-type', value: 'Num' },
  { type: 'rparen', value: ')' },
  { type: 'colon', value: ':' },
  { type: 'builtin-type', value: 'Num' },
  { type: 'arrow', value: '=>' },
  { type: 'lparen', value: '(' },
  { type: 'ident', value: 'a' },
  { type: 'plus', value: '+' },
  { type: 'ident', value: 'b' },
  { type: 'rparen', value: ')' },
  { type: 'plus', value: '+' },
  { type: 'ident', value: 'c' },
  { type: 'slash', value: '/' },
  { type: 'ident', value: 'd' },
  { type: 'newline', value: '\n' },

  { type: 'keyword', value: 'override' },
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
  { type: 'lparen', value: '(' },
  { type: 'ident', value: 'x' },
  { type: 'plus', value: '+' },
  { type: 'ident', value: 'y' },
  { type: 'rparen', value: ')' },
  { type: 'asterisk', value: '*' },
  { type: 'number', value: '2' },
  { type: 'newline', value: '\n' },

  { type: 'keyword', value: 'override' },
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
  { type: 'lparen', value: '(' },
  { type: 'ident', value: 'x' },
  { type: 'plus', value: '+' },
  { type: 'ident', value: 'y' },
  { type: 'plus', value: '+' },
  { type: 'ident', value: 'z' },
  { type: 'rparen', value: ')' },
  { type: 'asterisk', value: '*' },
  { type: 'number', value: '2' },
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

  { type: 'ident', value: 'addition' },
  { type: 'lparen', value: '(' },
  { type: 'number', value: '1' },
  { type: 'comma', value: ',' },
  { type: 'number', value: '2' },
  { type: 'rparen', value: ')' },
  { type: 'newline', value: '\n' },
];

const ast: AST = [
  {
    type: 'FunctionDeclaration',
    return: DT.Void,
    name: 'addition',
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
    return: DT.Void,
    name: 'addition_1',
    arguments: [
      { ident: 'x', type: DT.Num },
      { ident: 'y', type: DT.Num },
      { ident: 'z', type: DT.Num }
    ],
    outputType: DT.Num,
    body: [
      {
        type: 'BinaryOpExpr',
        return: DT.Num,
        operator: Op.Plus,
        expr1: Arithmetic('x', '+', 'y'),
        expr2: { type: 'IdentLiteral', value: 'z', return: DT.Num },
      }
    ],
  },
  {
    type: 'FunctionDeclaration',
    return: DT.Void,
    name: 'addition_2',
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
        return: DT.Num,
        operator: Op.Plus,
        expr1: {
          type: 'BinaryOpExpr',
          return: DT.Num,
          operator: Op.Plus,
          expr1: Arithmetic('w', '+', 'x'),
          expr2: { type: 'IdentLiteral', value: 'y', return: DT.Num },
        },
        expr2: { type: 'IdentLiteral', value: 'z', return: DT.Num },
      }
    ],
  },
  {
    type: 'FunctionInvokeExpr',
    name: 'addition_1',
    params: [
      NumberLiteral(1),
      NumberLiteral(2),
      NumberLiteral(3),
    ],
    return: DT.Num,
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
    name: 'addition_2',
    params: [
      NumberLiteral(1),
      NumberLiteral(2),
      NumberLiteral(3),
      NumberLiteral(4),
    ],
    return: DT.Num,
  },
  {
    type: 'FunctionDeclaration',
    return: DT.Void,
    name: 'addition_2$1',
    arguments: [
      { ident: 'a', type: DT.Num },
      { ident: 'b', type: DT.Num },
      { ident: 'c', type: DT.Num },
      { ident: 'd', type: DT.Num }
    ],
    outputType: DT.Num,
    body: [
      {
        type: 'BinaryOpExpr',
        return: DT.Num,
        operator: Op.Plus,
        expr1: {
          type: 'PrioritizedExpr',
          return: DT.Num,
          expr: Arithmetic('a', '+', 'b'),
        },
        expr2: {
          type: 'BinaryOpExpr',
          operator: Op.Slash,
          return: DT.Num,
          expr1: { type: 'IdentLiteral', value: 'c', return: DT.Num },
          expr2: { type: 'IdentLiteral', value: 'd', return: DT.Num },
        },
      },
    ],
  },
  {
    type: 'FunctionDeclaration',
    return: DT.Void,
    name: 'addition$1',
    arguments: [
      { ident: 'x', type: DT.Num },
      { ident: 'y', type: DT.Num }
    ],
    outputType: DT.Num,
    body: [
      {
        type: 'BinaryOpExpr',
        operator: Op.Asterisk,
        return: DT.Num,
        expr1: {
          type: 'PrioritizedExpr',
          return: DT.Num,
          expr: Arithmetic('x', '+', 'y')
        },
        expr2: NumberLiteral(2)
      },
    ],
  },
  {
    type: 'FunctionDeclaration',
    return: DT.Void,
    name: 'addition_1$1',
    arguments: [
      { ident: 'x', type: DT.Num },
      { ident: 'y', type: DT.Num },
      { ident: 'z', type: DT.Num }
    ],
    outputType: DT.Num,
    body: [
      {
        type: 'BinaryOpExpr',
        operator: Op.Asterisk,
        return: DT.Num,
        expr1: {
          type: 'PrioritizedExpr',
          return: DT.Num,
          expr: {
            type: 'BinaryOpExpr',
            return: DT.Num,
            operator: Op.Plus,
            expr1: Arithmetic('x', '+', 'y'),
            expr2: { type: 'IdentLiteral', value: 'z', return: DT.Num },
          }
        },
        expr2: NumberLiteral(2)
      },
    ],
  },
  {
    type: 'FunctionInvokeExpr',
    name: 'addition_1$1',
    params: [
      NumberLiteral(1),
      NumberLiteral(2),
      NumberLiteral(3)
    ],
    return: DT.Num,
  },
  {
    type: 'FunctionInvokeExpr',
    name: 'addition_2$1',
    params: [
      NumberLiteral(1),
      NumberLiteral(2),
      NumberLiteral(3),
      NumberLiteral(4)
    ],
    return: DT.Num,
  },
  {
    type: 'FunctionInvokeExpr',
    name: 'addition$1',
    params: [
      NumberLiteral(1),
      NumberLiteral(2)
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

addition_1(1, 2, 3);
addition(1, 2);
addition_2(1, 2, 3, 4);
function addition_2$1(a, b, c, d) {
  return (a + b) + (c / d);
}

function addition$1(x, y) {
  return (x + y) * 2;
}

function addition_1$1(x, y, z) {
  return (x + y + z) * 2;
}

addition_1$1(1, 2, 3);
addition_2$1(1, 2, 3, 4);
addition$1(1, 2);
`;

const minified =  'function addition(x,y){return x+y;}function addition_1(x,y,z){return x+y+z;}function addition_2(w,x,y,z){return w+x+y+z;}addition_1(1,2,3);addition(1,2);addition_2(1,2,3,4);function addition_2$1(a,b,c,d){return (a+b)+(c/d);}function addition$1(x,y){return (x+y)*2;}function addition_1$1(x,y,z){return (x+y+z)*2;}addition_1$1(1,2,3);addition_2$1(1,2,3,4);addition$1(1,2);';

export {
  tokens,
  ast,
  compiled,
  minified,
};
