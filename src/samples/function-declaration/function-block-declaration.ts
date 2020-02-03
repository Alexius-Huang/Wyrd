import { Token, AST, Operator as Op } from '../../types';
import { NumberLiteral, Arithmetic } from '../helper';

const program = `\
def addition(x: Num, y: Num): Num do
  x + y
end

def complexArithmetic(w: Num, x: Num, y: Num, z: Num): Num do
  a = x + y * z
  b = w - 2 / a + 1
  b
end
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
  { type: 'keyword', value: 'do' },
  { type: 'newline', value: '\n' },
  { type: 'ident', value: 'x' },
  { type: 'plus', value: '+' },
  { type: 'ident', value: 'y' },
  { type: 'newline', value: '\n' },
  { type: 'keyword', value: 'end' },
  { type: 'newline', value: '\n' },
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
  { type: 'keyword', value: 'do' },
  { type: 'newline', value: '\n' },
  { type: 'ident', value: 'a' },
  { type: 'eq', value: '=' },
  { type: 'ident', value: 'x' },
  { type: 'plus', value: '+' },
  { type: 'ident', value: 'y' },
  { type: 'asterisk', value: '*' },
  { type: 'ident', value: 'z' },
  { type: 'newline', value: '\n' },
  { type: 'ident', value: 'b' },
  { type: 'eq', value: '=' },
  { type: 'ident', value: 'w' },
  { type: 'dash', value: '-' },
  { type: 'number', value: '2' },
  { type: 'slash', value: '/' },
  { type: 'ident', value: 'a' },
  { type: 'plus', value: '+' },
  { type: 'number', value: '1' },
  { type: 'newline', value: '\n' },
  { type: 'ident', value: 'b' },
  { type: 'newline', value: '\n' },
  { type: 'keyword', value: 'end' },
  { type: 'newline', value: '\n' },
];

const ast: AST = [
  {
    type: 'FunctionDeclaration',
    returnType: 'Void',
    name: 'addition',
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
        type: 'AssignmentExpr',
        returnType: 'Void',
        expr1: { type: 'IdentLiteral', value: 'a', returnType: 'Num' },
        expr2: {
          type: 'BinaryOpExpr',
          operator: Op.Plus,
          returnType: 'Num',
          expr1: { type: 'IdentLiteral', value: 'x', returnType: 'Num' },
          expr2: Arithmetic('y', '*', 'z'),
        },
      },
      {
        type: 'AssignmentExpr',
        returnType: 'Void',
        expr1: { type: 'IdentLiteral', value: 'b', returnType: 'Num' },
        expr2: {
          type: 'BinaryOpExpr',
          operator: Op.Plus,
          returnType: 'Num',
          expr1: {
            type: 'BinaryOpExpr',
            operator: Op.Dash,
            returnType: 'Num',
            expr1: { type: 'IdentLiteral', value: 'w', returnType: 'Num' },
            expr2: Arithmetic(2, '/', 'a'),
          },
          expr2: NumberLiteral('1'),
        },
      },
      { type: 'IdentLiteral', value: 'b', returnType: 'Num' },
    ],
  },
];

const compiled = `\
function addition(x, y) {
  return x + y;
}

function complexArithmetic(w, x, y, z) {
  const a = x + (y * z);
  const b = w - (2 / a) + 1;
  return b;
}

`;

export {
  program,
  tokens,
  ast,
  compiled,
};
