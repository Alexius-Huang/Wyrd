import { Token, AST, Operator as Op } from '../../../types';

const program = `\
[1 (2 + 3 * 4) (5 / (6 - 7)) 8 (9) 10]
`;

const tokens: Array<Token> = [
  { type: 'lbracket', value: '[' },
  { type: 'number', value: '1' },
  { type: 'lparen', value: '(' },
  { type: 'number', value: '2' },
  { type: 'plus', value: '+' },
  { type: 'number', value: '3' },
  { type: 'asterisk', value: '*' },
  { type: 'number', value: '4' },
  { type: 'rparen', value: ')' },
  { type: 'lparen', value: '(' },
  { type: 'number', value: '5' },
  { type: 'slash', value: '/' },
  { type: 'lparen', value: '(' },
  { type: 'number', value: '6' },
  { type: 'dash', value: '-' },
  { type: 'number', value: '7' },
  { type: 'rparen', value: ')' },
  { type: 'rparen', value: ')' },
  { type: 'number', value: '8' },
  { type: 'lparen', value: '(' },
  { type: 'number', value: '9' },
  { type: 'rparen', value: ')' },
  { type: 'number', value: '10' },
  { type: 'rbracket', value: ']' },
  { type: 'newline', value: '\n' },
];

const ast: AST = [
  {
    type: 'ListLiteral',
    values: [
      { type: 'NumberLiteral', value: '1', returnType: 'Num' },
      {
        type: 'BinaryOpExpr',
        operator: Op.Plus,
        returnType: 'Num',
        expr1: { type: 'NumberLiteral', value: '2', returnType: 'Num' },
        expr2: {
          type: 'BinaryOpExpr',
          operator: Op.Asterisk,
          returnType: 'Num',
          expr1: { type: 'NumberLiteral', value: '3', returnType: 'Num' },
          expr2: { type: 'NumberLiteral', value: '4', returnType: 'Num' },
        },
      },
      {
        type: 'BinaryOpExpr',
        operator: Op.Slash,
        returnType: 'Num',
        expr1: { type: 'NumberLiteral', value: '5', returnType: 'Num' },
        expr2: {
          type: 'PrioritizedExpr',
          returnType: 'Num',
          expr: {
            type: 'BinaryOpExpr',
            operator: Op.Dash,
            returnType: 'Num',
            expr1: { type: 'NumberLiteral', value: '6', returnType: 'Num' },
            expr2: { type: 'NumberLiteral', value: '7', returnType: 'Num' },
          },
        },
      },
      { type: 'NumberLiteral', value: '8', returnType: 'Num' },
      { type: 'NumberLiteral', value: '9', returnType: 'Num' },
      { type: 'NumberLiteral', value: '10', returnType: 'Num' },
    ],
    elementType: 'Num',
    returnType: 'List[Num]',
  },
];

const compiled = `\
[1, 2 + (3 * 4), 5 / (6 - 7), 8, 9, 10];
`;

export {
  program,
  tokens,
  ast,
  compiled,
};
