import { Token, AST, Operator as Op } from '../src/types';

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
    arguments: [
      { ident: 'x', type: 'Num' },
      { ident: 'y', type: 'Num' }
    ],
    outputType: 'Num',
    body: [
      {
        type: 'BinaryOpExpr',
        operator: Op.Plus,
        expr1: {
          type: 'IdentLiteral',
          value: 'x'
        },
        expr2: {
          type: 'IdentLiteral',
          value: 'y'
        }
      },
    ],
  },
  {
    type: 'FunctionDeclaration',
    name: 'devilNumber',
    arguments: [],
    outputType: 'Num',
    body: [
      {
        type: 'NumberLiteral',
        value: '666'
      },
    ],
  },
  {
    type: 'FunctionDeclaration',
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
        expr1: {
          type: 'PrioritizedExpr',
          expr: {
            type: 'BinaryOpExpr',
            operator: Op.Plus,
            expr1: {
              type: 'IdentLiteral',
              value: 'x'
            },
            expr2: {
              type: 'IdentLiteral',
              value: 'y'
            },
          },
        },
        expr2: {
          type: 'PrioritizedExpr',
          expr: {
            type: 'BinaryOpExpr',
            operator: Op.Slash,
            expr1: {
              type: 'IdentLiteral',
              value: 'z'
            },
            expr2: {
              type: 'IdentLiteral',
              value: 'w'
            }
          },
        },
      },
    ],
  },
  {
    type: 'FunctionDeclaration',
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
        expr1: {
          type: 'IdentLiteral',
          value: 'x'
        },
        expr2: {
          type: 'BinaryOpExpr',
          operator: Op.Asterisk,
          expr1: {
            type: 'IdentLiteral',
            value: 'y'
          },
          expr2: {
            type: 'PrioritizedExpr',
            expr: {
              type: 'BinaryOpExpr',
              operator: Op.Slash,
              expr1: {
                type: 'IdentLiteral',
                value: 'z'
              },
              expr2: {
                type: 'IdentLiteral',
                value: 'w'
              }
            }
          }
        },
      }
    ],
  },
];

const compiled = `\
function addition(x, y) {
  if (typeof x === 'number' && typeof y === 'number') {
    return x + y;
  }

  throw new Error('Wrong Parameter Type in function \`addition\`');
}

function devilNumber() {
  return 666;
}

function complexArithmetic(w, x, y, z) {
  if (typeof w === 'number' && typeof x === 'number' && typeof y === 'number' && typeof z === 'number') {
    return (x + y) * (z / w);
  }

  throw new Error('Wrong Parameter Type in function \`complexArithmetic\`');
}

function complexArithmetic2(w, x, y, z) {
  if (typeof w === 'number' && typeof x === 'number' && typeof y === 'number' && typeof z === 'number') {
    return x + (y * (z / w));
  }

  throw new Error('Wrong Parameter Type in function \`complexArithmetic2\`');
}

`;

export {
  program,
  tokens,
  ast,
  compiled,
};
