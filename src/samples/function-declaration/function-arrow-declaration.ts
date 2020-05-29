import { Token, AST, Operator as Op } from '../../types';
import { NumberLiteral, prioritize, Arithmetic } from '../helper';
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
  { type: 'ident', value: 'devilNumber' },
  { type: 'colon', value: ':' },
  { type: 'builtin-type', value: 'Num' },
  { type: 'arrow', value: '=>' },
  { type: 'number', value: '666' },
  { type: 'newline', value: '\n' },

  { type: 'keyword', value: 'def' },
  { type: 'ident', value: 'complexArithmetic' },
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
  { type: 'lparen', value: '(' },
  { type: 'ident', value: 'x' },
  { type: 'plus', value: '+' },
  { type: 'ident', value: 'y' },
  { type: 'rparen', value: ')' },
  { type: 'asterisk', value: '*' },
  { type: 'lparen', value: '(' },
  { type: 'ident', value: 'z' },
  { type: 'slash', value: '/' },
  { type: 'ident', value: 'w' },
  { type: 'rparen', value: ')' },
  { type: 'newline', value: '\n' },

  { type: 'keyword', value: 'def' },
  { type: 'ident', value: 'complexArithmetic2' },
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
  { type: 'ident', value: 'x' },
  { type: 'plus', value: '+' },
  { type: 'ident', value: 'y' },
  { type: 'asterisk', value: '*' },
  { type: 'lparen', value: '(' },
  { type: 'ident', value: 'z' },
  { type: 'slash', value: '/' },
  { type: 'ident', value: 'w' },
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
    return: DT.Void,
    name: 'devilNumber',
    arguments: [],
    outputType: DT.Num,
    body: [
      NumberLiteral(666),
    ],
  },
  {
    type: 'FunctionDeclaration',
    return: DT.Void,
    name: 'complexArithmetic',
    arguments: [
      { ident: 'w', type: DT.Num },
      { ident: 'x', type: DT.Num },
      { ident: 'y', type: DT.Num },
      { ident: 'z', type: DT.Num },
    ],
    outputType: DT.Num,
    body: [
      {
        type: 'BinaryOpExpr',
        operator: Op.Asterisk,
        return: DT.Num,
        expr1: prioritize(Arithmetic('x', '+', 'y')),
        expr2: prioritize(Arithmetic('z', '/', 'w')),
      },
    ],
  },
  {
    type: 'FunctionDeclaration',
    return: DT.Void,
    name: 'complexArithmetic2',
    arguments: [
      { ident: 'w', type: DT.Num },
      { ident: 'x', type: DT.Num },
      { ident: 'y', type: DT.Num },
      { ident: 'z', type: DT.Num },
    ],
    outputType: DT.Num,
    body: [
      {
        type: 'BinaryOpExpr',
        operator: Op.Plus,
        return: DT.Num,
        expr1: { type: 'IdentLiteral', value: 'x', return: DT.Num },
        expr2: {
          type: 'BinaryOpExpr',
          operator: Op.Asterisk,
          return: DT.Num,
          expr1: { type: 'IdentLiteral', value: 'y', return: DT.Num },
          expr2: prioritize(Arithmetic('z', '/', 'w')),
        },
      },
    ],
  },
];

const compiled = `\
function addition(x, y) {
  return x + y;
}

function devilNumber() {
  return 666;
}

function complexArithmetic(w, x, y, z) {
  return (x + y) * (z / w);
}

function complexArithmetic2(w, x, y, z) {
  return x + (y * (z / w));
}

`;

const minified = 'function addition(x,y){return x+y;}function devilNumber(){return 666;}function complexArithmetic(w,x,y,z){return (x+y)*(z/w);}function complexArithmetic2(w,x,y,z){return x+(y*(z/w));}';

export {
  tokens,
  ast,
  compiled,
  minified,
};
