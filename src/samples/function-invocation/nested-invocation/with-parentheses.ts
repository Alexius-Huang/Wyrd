import { Token, AST, Operator as Op, ParseOptions } from '../../../types';
import { createFunctionPatterns } from '../../helper';

const program = `\
funcA 1, 2, funcB(3, 4), 5
funcC 1 + 2 * funcD(3, 4), 5
`;

const tokens: Array<Token> = [
  { type: 'ident', value: 'funcA' },
  { type: 'number', value: '1' },
  { type: 'comma', value: ',' },
  { type: 'number', value: '2' },
  { type: 'comma', value: ',' },
  { type: 'ident', value: 'funcB' },
  { type: 'lparen', value: '(' },
  { type: 'number', value: '3' },
  { type: 'comma', value: ',' },
  { type: 'number', value: '4' },
  { type: 'rparen', value: ')' },
  { type: 'comma', value: ',' },
  { type: 'number', value: '5' },
  { type: 'newline', value: '\n' },

  { type: 'ident', value: 'funcC' },
  { type: 'number', value: '1' },
  { type: 'plus', value: '+' },
  { type: 'number', value: '2' },
  { type: 'asterisk', value: '*' },
  { type: 'ident', value: 'funcD' },
  { type: 'lparen', value: '(' },
  { type: 'number', value: '3' },
  { type: 'comma', value: ',' },
  { type: 'number', value: '4' },
  { type: 'rparen', value: ')' },
  { type: 'comma', value: ',' },
  { type: 'number', value: '5' },
  { type: 'newline', value: '\n' },
];

const ast: AST = [
  {
    type: 'FunctionInvokeExpr',
    name: 'funcA',
    params: [
      { type: 'NumberLiteral', value: '1', returnType: 'Num' },
      { type: 'NumberLiteral', value: '2', returnType: 'Num' },
      {
        type: 'FunctionInvokeExpr',
        name: 'funcB',
        params: [
          { type: 'NumberLiteral', value: '3', returnType: 'Num' },
          { type: 'NumberLiteral', value: '4', returnType: 'Num' },
        ],
        returnType: 'Num',
      },    
      { type: 'NumberLiteral', value: '5', returnType: 'Num' },
    ],
    returnType: 'Num',
  },
  {
    type: 'FunctionInvokeExpr',
    name: 'funcC',
    params: [
      {
        type: 'BinaryOpExpr',
        operator: Op.Plus,
        returnType: 'Num',
        expr1: { type: 'NumberLiteral', value: '1', returnType: 'Num' },
        expr2: {
          type: 'BinaryOpExpr',
          operator: Op.Asterisk,
          returnType: 'Num',
          expr1: { type: 'NumberLiteral', value: '2', returnType: 'Num' },
          expr2: {
            type: 'FunctionInvokeExpr',
            name: 'funcD',
            params: [
              { type: 'NumberLiteral', value: '3', returnType: 'Num' },
              { type: 'NumberLiteral', value: '4', returnType: 'Num' },
            ],
            returnType: 'Num',
          },
        },
      },
      { type: 'NumberLiteral', value: '5', returnType: 'Num' },
    ],
    returnType: 'Num',
  },
];

const compiled = `\
funcA(1, 2, funcB(3, 4), 5);
funcC(1 + (2 * funcD(3, 4)), 5);
`;

const parseOptions: ParseOptions = {
  functions: createFunctionPatterns([
    ['funcA', [['Num.Num.Num.Num', 'Num']]],
    ['funcB', [['Num.Num', 'Num']]],
    ['funcC', [['Num.Num', 'Num']]],
    ['funcD', [['Num.Num', 'Num']]],
  ]),
};

export {
  program,
  tokens,
  ast,
  compiled,
  parseOptions,
};
