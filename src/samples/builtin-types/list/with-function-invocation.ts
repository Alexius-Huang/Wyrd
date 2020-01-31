import { Token, AST, Operator as Op } from '../../../types';

const program = `\
def addition(x: Num, y: Num): Num => x + y
[1 addition(2, 3 + 4 * 5) 6 addition(7 / 8 - 9, 10)]
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

  { type: 'lbracket', value: '[' },
  { type: 'number', value: '1' },
  { type: 'ident', value: 'addition' },
  { type: 'lparen', value: '(' },
  { type: 'number', value: '2' },
  { type: 'comma', value: ',' },
  { type: 'number', value: '3' },
  { type: 'plus', value: '+' },
  { type: 'number', value: '4' },
  { type: 'asterisk', value: '*' },
  { type: 'number', value: '5' },
  { type: 'rparen', value: ')' },
  { type: 'number', value: '6' },
  { type: 'ident', value: 'addition' },
  { type: 'lparen', value: '(' },
  { type: 'number', value: '7' },
  { type: 'slash', value: '/' },
  { type: 'number', value: '8' },
  { type: 'dash', value: '-' },
  { type: 'number', value: '9' },
  { type: 'comma', value: ',' },
  { type: 'number', value: '10' },
  { type: 'rparen', value: ')' },
  { type: 'rbracket', value: ']' },
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
      {
        type: 'BinaryOpExpr',
        operator: Op.Plus,
        returnType: 'Num',
        expr1: { type: 'IdentLiteral', value: 'x', returnType: 'Num' },
        expr2: { type: 'IdentLiteral', value: 'y', returnType: 'Num' }
      },
    ],
  },
  {
    type: 'ListLiteral',
    values: [
      { type: 'NumberLiteral', value: '1', returnType: 'Num' },
      {
        type: 'FunctionInvokeExpr',
        name: 'addition',
        params: [
          { type: 'NumberLiteral', value: '2', returnType: 'Num' },
          {
            type: 'BinaryOpExpr',
            operator: Op.Plus,
            returnType: 'Num',
            expr1: { type: 'NumberLiteral', value: '3', returnType: 'Num' },
            expr2: {
              type: 'BinaryOpExpr',
              operator: Op.Asterisk,
              returnType: 'Num',
              expr1: { type: 'NumberLiteral', value: '4', returnType: 'Num' },
              expr2: { type: 'NumberLiteral', value: '5', returnType: 'Num' },
            },
          },
        ],
        returnType: 'Num',
      },
      { type: 'NumberLiteral', value: '6', returnType: 'Num' },
      {
        type: 'FunctionInvokeExpr',
        name: 'addition',
        params: [
          {
            type: 'BinaryOpExpr',
            operator: Op.Dash,
            returnType: 'Num',
            expr1: {
              type: 'BinaryOpExpr',
              operator: Op.Slash,
              returnType: 'Num',
              expr1: { type: 'NumberLiteral', value: '7', returnType: 'Num' },
              expr2: { type: 'NumberLiteral', value: '8', returnType: 'Num' },
            },
            expr2: { type: 'NumberLiteral', value: '9', returnType: 'Num' },
          },
          { type: 'NumberLiteral', value: '10', returnType: 'Num' },
        ],
        returnType: 'Num',
      },
    ],
    elementType: 'Num',
    returnType: 'List[Num]',
  },
];

const compiled = `\
function addition(x, y) {
  return x + y;
}

[1, addition(2, 3 + (4 * 5)), 6, addition(7 / 8 - 9, 10)];
`;

export {
  program,
  tokens,
  ast,
  compiled,
};
