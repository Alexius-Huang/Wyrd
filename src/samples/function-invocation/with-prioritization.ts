import { Token, AST, Operator as Op, ParseOptions } from '../../types';
import { createFunctionPatterns } from '../helper';

const program = `\
funcA(1, (funcB(2, 3) + 4) * funcC(5))
funcD(1 / (funcE(2, 3) - 4), 5)
funcF((1 - funcG(2) * 3) / 4, funcH(5))
`;

const tokens: Array<Token> = [
  { type: 'ident', value: 'funcA' },
  { type: 'lparen', value: '(' },
  { type: 'number', value: '1' },
  { type: 'comma', value: ',' },
  { type: 'lparen', value: '(' },
  { type: 'ident', value: 'funcB' },
  { type: 'lparen', value: '(' },
  { type: 'number', value: '2' },
  { type: 'comma', value: ',' },
  { type: 'number', value: '3' },
  { type: 'rparen', value: ')' },
  { type: 'plus', value: '+' },
  { type: 'number', value: '4' },
  { type: 'rparen', value: ')' },
  { type: 'asterisk', value: '*' },
  { type: 'ident', value: 'funcC' },
  { type: 'lparen', value: '(' },
  { type: 'number', value: '5' },
  { type: 'rparen', value: ')' },
  { type: 'rparen', value: ')' },
  { type: 'newline', value: '\n' },

  { type: 'ident', value: 'funcD' },
  { type: 'lparen', value: '(' },
  { type: 'number', value: '1' },
  { type: 'slash', value: '/' },
  { type: 'lparen', value: '(' },
  { type: 'ident', value: 'funcE' },
  { type: 'lparen', value: '(' },
  { type: 'number', value: '2' },
  { type: 'comma', value: ',' },
  { type: 'number', value: '3' },
  { type: 'rparen', value: ')' },
  { type: 'dash', value: '-' },
  { type: 'number', value: '4' },
  { type: 'rparen', value: ')' },
  { type: 'comma', value: ',' },
  { type: 'number', value: '5' },
  { type: 'rparen', value: ')' },
  { type: 'newline', value: '\n' },

  { type: 'ident', value: 'funcF' },
  { type: 'lparen', value: '(' },
  { type: 'lparen', value: '(' },
  { type: 'number', value: '1' },
  { type: 'dash', value: '-' },
  { type: 'ident', value: 'funcG' },
  { type: 'lparen', value: '(' },
  { type: 'number', value: '2' },
  { type: 'rparen', value: ')' },
  { type: 'asterisk', value: '*' },
  { type: 'number', value: '3' },
  { type: 'rparen', value: ')' },
  { type: 'slash', value: '/' },
  { type: 'number', value: '4' },
  { type: 'comma', value: ',' },
  { type: 'ident', value: 'funcH' },
  { type: 'lparen', value: '(' },
  { type: 'number', value: '5' },
  { type: 'rparen', value: ')' },
  { type: 'rparen', value: ')' },
  { type: 'newline', value: '\n' },
];

const ast: AST = [
  {
    type: 'FunctionInvokeExpr',
    name: 'funcA',
    params: [
      { type: 'NumberLiteral', value: '1', returnType: 'Num' },
      {
        type: 'BinaryOpExpr',
        operator: Op.Asterisk,
        returnType: 'Num',
        expr1: {
          type: 'PrioritizedExpr',
          returnType: 'Num',
          expr: {
            type: 'BinaryOpExpr',
            operator: Op.Plus,
            returnType: 'Num',
            expr1: {
              type: 'FunctionInvokeExpr',
              name: 'funcB',
              params: [
                { type: 'NumberLiteral', value: '2', returnType: 'Num' },
                { type: 'NumberLiteral', value: '3', returnType: 'Num' }
              ],
              returnType: 'Num',
            },
            expr2: { type: 'NumberLiteral', value: '4', returnType: 'Num' },
          },
        },
        expr2: {
          type: 'FunctionInvokeExpr',
          name: 'funcC',
          params: [
            { type: 'NumberLiteral', value: '5', returnType: 'Num' },
          ],
          returnType: 'Num'
        },
      },
    ],
    returnType: 'Num',
  },
  {
    type: 'FunctionInvokeExpr',
    name: 'funcD',
    params: [
      {
        type: 'BinaryOpExpr',
        operator: Op.Slash,
        returnType: 'Num',
        expr1: { type: 'NumberLiteral', value: '1', returnType: 'Num' },
        expr2: {
          type: 'PrioritizedExpr',
          returnType: 'Num',
          expr: {
            type: 'BinaryOpExpr',
            operator: Op.Dash,
            returnType: 'Num',
            expr1: {
              type: 'FunctionInvokeExpr',
              name: 'funcE',
              params: [
                { type: 'NumberLiteral', value: '2', returnType: 'Num' },
                { type: 'NumberLiteral', value: '3', returnType: 'Num' },
              ],
              returnType: 'Num',
            },
            expr2: { type: 'NumberLiteral', value: '4', returnType: 'Num' },
          },
        },
      },
      { type: 'NumberLiteral', value: '5', returnType: 'Num' },
    ],
    returnType: 'Num',
  },
  {
    type: 'FunctionInvokeExpr',
    name: 'funcF',
    params: [
      {
        type: 'BinaryOpExpr',
        operator: Op.Slash,
        returnType: 'Num',
        expr1: {
          type: 'PrioritizedExpr',
          returnType: 'Num',
          expr: {
            type: 'BinaryOpExpr',
            operator: Op.Dash,
            returnType: 'Num',
            expr1: { type: 'NumberLiteral', value: '1', returnType: 'Num' },
            expr2: {
              type: 'BinaryOpExpr',
              operator: Op.Asterisk,
              returnType: 'Num',
              expr1: {
                type: 'FunctionInvokeExpr',
                name: 'funcG',
                params: [
                  { type: 'NumberLiteral', value: '2', returnType: 'Num' },
                ],
                returnType: 'Num',
              },
              expr2: { type: 'NumberLiteral', value: '3', returnType: 'Num' },
            },
          },
        },
        expr2: { type: 'NumberLiteral', value: '4', returnType: 'Num' },
      },
      {
        type: 'FunctionInvokeExpr',
        name: 'funcH',
        params: [
          { type: 'NumberLiteral', value: '5', returnType: 'Num' },
        ],
        returnType: 'Num',
      },
    ],
    returnType: 'Num',
  },
];

const compiled = `\
funcA(1, (funcB(2, 3) + 4) * funcC(5));
funcD(1 / (funcE(2, 3) - 4), 5);
funcF((1 - (funcG(2) * 3)) / 4, funcH(5));
`;

const parseOptions: ParseOptions = {
  functions: createFunctionPatterns([
    ['funcA', [['Num.Num', 'Num']]],
    ['funcB', [['Num.Num', 'Num']]],
    ['funcC', [['Num', 'Num']]],
    ['funcD', [['Num.Num', 'Num']]],
    ['funcE', [['Num.Num', 'Num']]],
    ['funcF', [['Num.Num', 'Num']]],
    ['funcG', [['Num', 'Num']]],
    ['funcH', [['Num', 'Num']]],
  ]),
};

export {
  program,
  tokens,
  ast,
  compiled,
  parseOptions,
};
