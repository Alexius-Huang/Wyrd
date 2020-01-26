import { Token, AST, Operator as Op, WyrdPrimitives as WP } from '../types';

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
        expr1: { type: 'IdentLiteral', value: 'a' },
        expr2: {
          type: 'BinaryOpExpr',
          operator: Op.Plus,
          expr1: { type: 'IdentLiteral', value: 'x' },
          expr2: {
            type: 'BinaryOpExpr',
            operator: Op.Asterisk,
            expr1: { type: 'IdentLiteral', value: 'y' },
            expr2: { type: 'IdentLiteral', value: 'z' }
          },
        },
      },
      {
        type: 'AssignmentExpr',
        expr1: { type: 'IdentLiteral', value: 'b' },
        expr2: {
          type: 'BinaryOpExpr',
          operator: Op.Plus,
          expr1: {
            type: 'BinaryOpExpr',
            operator: Op.Dash,
            expr1: { type: 'IdentLiteral', value: 'w' },
            expr2: {
              type: 'BinaryOpExpr',
              operator: Op.Slash,
              expr1: { type: 'NumberLiteral', value: '2', returnType: WP.Num },
              expr2: { type: 'IdentLiteral', value: 'a' },
            },
          },
          expr2: { type: 'NumberLiteral', value: '1', returnType: WP.Num }
        },
      },
      {
        type: 'IdentLiteral',
        value: 'b'
      },
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

function complexArithmetic(w, x, y, z) {
  if (typeof w === 'number' && typeof x === 'number' && typeof y === 'number' && typeof z === 'number') {
    const a = x + (y * z);
    const b = w - (2 / a) + 1;
    return b;
  }

  throw new Error('Wrong Parameter Type in function \`complexArithmetic\`');
}

`;

export {
  program,
  tokens,
  ast,
  compiled,
};
