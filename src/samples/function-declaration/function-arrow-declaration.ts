import { Token, AST, Operator as Op } from '../../types';
import { NumberLiteral, prioritize, Arithmetic } from '../helper';

const program = `\
def addition(x: Num, y: Num): Num => x + y
def devilNumber: Num => 666
def complexArithmetic(w: Num, x: Num, y: Num, z: Num): Num => (x + y) * (z / w)
def complexArithmetic2(w: Num, x: Num, y: Num, z: Num): Num => x + y * (z / w)
`;

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
    returnType: 'Void',
    arguments: [
      { ident: 'x', type: 'Num' },
      { ident: 'y', type: 'Num' }
    ],
    outputType: 'Num',
    body: [
      Arithmetic('x', '+', 'y'),
    ],
  },
  {
    type: 'FunctionDeclaration',
    returnType: 'Void',
    name: 'devilNumber',
    arguments: [],
    outputType: 'Num',
    body: [
      NumberLiteral(666),
    ],
  },
  {
    type: 'FunctionDeclaration',
    returnType: 'Void',
    name: 'complexArithmetic',
    arguments: [
      { ident: 'w', type: 'Num' },
      { ident: 'x', type: 'Num' },
      { ident: 'y', type: 'Num' },
      { ident: 'z', type: 'Num' },
    ],
    outputType: 'Num',
    body: [
      {
        type: 'BinaryOpExpr',
        operator: Op.Asterisk,
        returnType: 'Num',
        expr1: prioritize(Arithmetic('x', '+', 'y')),
        expr2: prioritize(Arithmetic('z', '/', 'w')),
      },
    ],
  },
  {
    type: 'FunctionDeclaration',
    returnType: 'Void',
    name: 'complexArithmetic2',
    arguments: [
      { ident: 'w', type: 'Num' },
      { ident: 'x', type: 'Num' },
      { ident: 'y', type: 'Num' },
      { ident: 'z', type: 'Num' },
    ],
    outputType: 'Num',
    body: [
      {
        type: 'BinaryOpExpr',
        operator: Op.Plus,
        returnType: 'Num',
        expr1: { type: 'IdentLiteral', value: 'x', returnType: 'Num' },
        expr2: {
          type: 'BinaryOpExpr',
          operator: Op.Asterisk,
          returnType: 'Num',
          expr1: { type: 'IdentLiteral', value: 'y', returnType: 'Num' },
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
  program,
  tokens,
  ast,
  compiled,
  minified,
};
