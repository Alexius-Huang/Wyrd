import { Token, AST, Operator as Op, ParseOptions, FunctionPattern } from '../../../types';
import { createFunctionPatterns } from '../../helper';

const program = `\
funcA 1, funcB 2, 3, 4, 5
funcC 1, 2, funcD 3, 4, 5
funcE 1, funcF 2, 3, funcG 4, 5
funcH funcI 1, 2, funcJ 3, 4, funcK 5
`;

const tokens: Array<Token> = [
  { type: 'ident', value: 'funcA' },
  { type: 'number', value: '1' },
  { type: 'comma', value: ',' },
  { type: 'ident', value: 'funcB' },
  { type: 'number', value: '2' },
  { type: 'comma', value: ',' },
  { type: 'number', value: '3' },
  { type: 'comma', value: ',' },
  { type: 'number', value: '4' },
  { type: 'comma', value: ',' },
  { type: 'number', value: '5' },
  { type: 'newline', value: '\n' },

  { type: 'ident', value: 'funcC' },
  { type: 'number', value: '1' },
  { type: 'comma', value: ',' },
  { type: 'number', value: '2' },
  { type: 'comma', value: ',' },
  { type: 'ident', value: 'funcD' },
  { type: 'number', value: '3' },
  { type: 'comma', value: ',' },
  { type: 'number', value: '4' },
  { type: 'comma', value: ',' },
  { type: 'number', value: '5' },
  { type: 'newline', value: '\n' },

  { type: 'ident', value: 'funcE' },
  { type: 'number', value: '1' },
  { type: 'comma', value: ',' },
  { type: 'ident', value: 'funcF' },
  { type: 'number', value: '2' },
  { type: 'comma', value: ',' },
  { type: 'number', value: '3' },
  { type: 'comma', value: ',' },
  { type: 'ident', value: 'funcG' },
  { type: 'number', value: '4' },
  { type: 'comma', value: ',' },
  { type: 'number', value: '5' },
  { type: 'newline', value: '\n' },

  { type: 'ident', value: 'funcH' },
  { type: 'ident', value: 'funcI' },
  { type: 'number', value: '1' },
  { type: 'comma', value: ',' },
  { type: 'number', value: '2' },
  { type: 'comma', value: ',' },
  { type: 'ident', value: 'funcJ' },
  { type: 'number', value: '3' },
  { type: 'comma', value: ',' },
  { type: 'number', value: '4' },
  { type: 'comma', value: ',' },
  { type: 'ident', value: 'funcK' },
  { type: 'number', value: '5' },
  { type: 'newline', value: '\n' },
];

const ast: AST = [
  {
    type: 'FunctionInvokeExpr',
    name: 'funcA',
    params: [
      { type: 'NumberLiteral', value: '1', returnType: 'Num' },
      {
        type: 'FunctionInvokeExpr',
        name: 'funcB',
        params: [
          { type: 'NumberLiteral', value: '2', returnType: 'Num' },
          { type: 'NumberLiteral', value: '3', returnType: 'Num' },
          { type: 'NumberLiteral', value: '4', returnType: 'Num' },
          { type: 'NumberLiteral', value: '5', returnType: 'Num' },
        ],
        returnType: 'Num',
      }
    ],
    returnType: 'Num',
  },
  {
    type: 'FunctionInvokeExpr',
    name: 'funcC',
    params: [
      { type: 'NumberLiteral', value: '1', returnType: 'Num' },
      { type: 'NumberLiteral', value: '2', returnType: 'Num' },
      {
        type: 'FunctionInvokeExpr',
        name: 'funcD',
        params: [
          { type: 'NumberLiteral', value: '3', returnType: 'Num' },
          { type: 'NumberLiteral', value: '4', returnType: 'Num' },
          { type: 'NumberLiteral', value: '5', returnType: 'Num' },
        ],
        returnType: 'Num',
      }
    ],
    returnType: 'Num',
  },
  {
    type: 'FunctionInvokeExpr',
    name: 'funcE',
    params: [
      { type: 'NumberLiteral', value: '1', returnType: 'Num' },
      {
        type: 'FunctionInvokeExpr',
        name: 'funcF',
        params: [
          { type: 'NumberLiteral', value: '2', returnType: 'Num' },
          { type: 'NumberLiteral', value: '3', returnType: 'Num' },
          {
            type: 'FunctionInvokeExpr',
            name: 'funcG',
            params: [
              { type: 'NumberLiteral', value: '4', returnType: 'Num' },
              { type: 'NumberLiteral', value: '5', returnType: 'Num' },
            ],
            returnType: 'Num',
          }
        ],
        returnType: 'Num',
      }
    ],
    returnType: 'Num',
  },
  {
    type: 'FunctionInvokeExpr',
    name: 'funcH',
    params: [
      {
        type: 'FunctionInvokeExpr',
        name: 'funcI',
        params: [
          { type: 'NumberLiteral', value: '1', returnType: 'Num' },
          { type: 'NumberLiteral', value: '2', returnType: 'Num' },
          {
            type: 'FunctionInvokeExpr',
            name: 'funcJ',
            params: [
              { type: 'NumberLiteral', value: '3', returnType: 'Num' },
              { type: 'NumberLiteral', value: '4', returnType: 'Num' },
              {
                type: 'FunctionInvokeExpr',
                name: 'funcK',
                params: [
                  { type: 'NumberLiteral', value: '5', returnType: 'Num' },
                ],
                returnType: 'Num',
              }
            ],
            returnType: 'Num',
          }
        ],
        returnType: 'Num',
      },
    ],
    returnType: 'Num',
  },
];

const compiled = `\
funcA(1, funcB(2, 3, 4, 5));
funcC(1, 2, funcD(3, 4, 5));
funcE(1, funcF(2, 3, funcG(4, 5)));
funcH(funcI(1, 2, funcJ(3, 4, funcK(5))));
`;

const parseOptions: ParseOptions = {
  functions: createFunctionPatterns([
    ['funcA', [['Num.Num', 'Num']]],
    ['funcB', [['Num.Num.Num.Num', 'Num']]],
    ['funcC', [['Num.Num.Num', 'Num']]],
    ['funcD', [['Num.Num.Num', 'Num']]],
    ['funcE', [['Num.Num', 'Num']]],
    ['funcF', [['Num.Num.Num', 'Num']]],
    ['funcG', [['Num.Num', 'Num']]],
    ['funcH', [['Num', 'Num']]],
    ['funcI', [['Num.Num.Num', 'Num']]],
    ['funcJ', [['Num.Num.Num', 'Num']]],
    ['funcK', [['Num', 'Num']]],
  ]),
};

export {
  program,
  tokens,
  ast,
  compiled,
  parseOptions,
};
