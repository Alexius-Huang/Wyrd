import { Token, AST, Operator as Op, ParseOptions } from '../../types';
import { createFunctionPatterns, prioritize, Arithmetic } from '../helper';
import { NumberLiteral, StringLiteral } from '../helper';

const program = `\
funcA("Hello world")
funcB(1, 2, 3)
funcC(1, 2 + 3 * 4, 5 / 6 - 7)
funcD(1, 2 + 3 * 4, 5) / 6 - 7
funcE(1, 2 + 3 * 4 + 5) - 6 / 7
funcF(1, 2 + 3 * (4 / 5)) / (6 - 7)
1 + 2 * funcG(3 * 4, 5) / 6 - 7
`;

const tokens: Array<Token> = [
  { type: 'ident', value: 'funcA' },
  { type: 'lparen', value: '(' },
  { type: 'string', value: 'Hello world' },
  { type: 'rparen', value: ')' },
  { type: 'newline', value: '\n' },

  { type: 'ident', value: 'funcB' },
  { type: 'lparen', value: '(' },
  { type: 'number', value: '1' },
  { type: 'comma', value: ',' },
  { type: 'number', value: '2' },
  { type: 'comma', value: ',' },
  { type: 'number', value: '3' },
  { type: 'rparen', value: ')' },
  { type: 'newline', value: '\n' },

  { type: 'ident', value: 'funcC' },
  { type: 'lparen', value: '(' },
  { type: 'number', value: '1' },
  { type: 'comma', value: ',' },
  { type: 'number', value: '2' },
  { type: 'plus', value: '+' },
  { type: 'number', value: '3' },
  { type: 'asterisk', value: '*' },
  { type: 'number', value: '4' },
  { type: 'comma', value: ',' },
  { type: 'number', value: '5' },
  { type: 'slash', value: '/' },
  { type: 'number', value: '6' },
  { type: 'dash', value: '-' },
  { type: 'number', value: '7' },
  { type: 'rparen', value: ')' },
  { type: 'newline', value: '\n' },

  { type: 'ident', value: 'funcD' },
  { type: 'lparen', value: '(' },
  { type: 'number', value: '1' },
  { type: 'comma', value: ',' },
  { type: 'number', value: '2' },
  { type: 'plus', value: '+' },
  { type: 'number', value: '3' },
  { type: 'asterisk', value: '*' },
  { type: 'number', value: '4' },
  { type: 'comma', value: ',' },
  { type: 'number', value: '5' },
  { type: 'rparen', value: ')' },
  { type: 'slash', value: '/' },
  { type: 'number', value: '6' },
  { type: 'dash', value: '-' },
  { type: 'number', value: '7' },
  { type: 'newline', value: '\n' },

  { type: 'ident', value: 'funcE' },
  { type: 'lparen', value: '(' },
  { type: 'number', value: '1' },
  { type: 'comma', value: ',' },
  { type: 'number', value: '2' },
  { type: 'plus', value: '+' },
  { type: 'number', value: '3' },
  { type: 'asterisk', value: '*' },
  { type: 'number', value: '4' },
  { type: 'plus', value: '+' },
  { type: 'number', value: '5' },
  { type: 'rparen', value: ')' },
  { type: 'dash', value: '-' },
  { type: 'number', value: '6' },
  { type: 'slash', value: '/' },
  { type: 'number', value: '7' },
  { type: 'newline', value: '\n' },

  { type: 'ident', value: 'funcF' },
  { type: 'lparen', value: '(' },
  { type: 'number', value: '1' },
  { type: 'comma', value: ',' },
  { type: 'number', value: '2' },
  { type: 'plus', value: '+' },
  { type: 'number', value: '3' },
  { type: 'asterisk', value: '*' },
  { type: 'lparen', value: '(' },
  { type: 'number', value: '4' },
  { type: 'slash', value: '/' },
  { type: 'number', value: '5' },
  { type: 'rparen', value: ')' },
  { type: 'rparen', value: ')' },
  { type: 'slash', value: '/' },
  { type: 'lparen', value: '(' },
  { type: 'number', value: '6' },
  { type: 'dash', value: '-' },
  { type: 'number', value: '7' },
  { type: 'rparen', value: ')' },
  { type: 'newline', value: '\n' },

  { type: 'number', value: '1' },
  { type: 'plus', value: '+' },
  { type: 'number', value: '2' },
  { type: 'asterisk', value: '*' },
  { type: 'ident', value: 'funcG' },
  { type: 'lparen', value: '(' },
  { type: 'number', value: '3' },
  { type: 'asterisk', value: '*' },
  { type: 'number', value: '4' },
  { type: 'comma', value: ',' },
  { type: 'number', value: '5' },
  { type: 'rparen', value: ')' },
  { type: 'slash', value: '/' },
  { type: 'number', value: '6' },
  { type: 'dash', value: '-' },
  { type: 'number', value: '7' },
  { type: 'newline', value: '\n' },
];

const ast: AST = [
  {
    type: 'FunctionInvokeExpr',
    name: 'funcA',
    params: [
      StringLiteral('Hello world'),
    ],
    returnType: 'Null'
  },
  {
    type: 'FunctionInvokeExpr',
    name: 'funcB',
    params: [
      NumberLiteral(1),
      NumberLiteral(2),
      NumberLiteral(3),
    ],
    returnType: 'Null'
  },
  {
    type: 'FunctionInvokeExpr',
    name: 'funcC',
    params: [
      NumberLiteral(1),
      {
        type: 'BinaryOpExpr',
        operator: Op.Plus,
        returnType: 'Num',
        expr1: NumberLiteral(2),
        expr2: Arithmetic(3, '*', 4),
      },
      {
        type: 'BinaryOpExpr',
        operator: Op.Dash,
        returnType: 'Num',
        expr1: Arithmetic(5, '/', 6),
        expr2: NumberLiteral(7),
      },
    ],
    returnType: 'Null',
  },
  {
    type: 'BinaryOpExpr',
    operator: Op.Dash,
    returnType: 'Num',
    expr1: {
      type: 'BinaryOpExpr',
      operator: Op.Slash,
      returnType: 'Num',
      expr1: {
        type: 'FunctionInvokeExpr',
        name: 'funcD',
        params: [
          NumberLiteral(1),
          {
            type: 'BinaryOpExpr',
            operator: Op.Plus,
            returnType: 'Num',
            expr1: NumberLiteral(2),
            expr2: Arithmetic(3, '*', 4),
          },
          NumberLiteral(5),  
        ],
        returnType: 'Num',
      },
      expr2: NumberLiteral(6),
    },
    expr2: NumberLiteral(7),
  },
  {
    type: 'BinaryOpExpr',
    operator: Op.Dash,
    returnType: 'Num',
    expr1: {
      type: 'FunctionInvokeExpr',
      name: 'funcE',
      params: [
        NumberLiteral(1),
        {
          type: 'BinaryOpExpr',
          operator: Op.Plus,
          returnType: 'Num',
          expr1: {
            type: 'BinaryOpExpr',
            operator: Op.Plus,
            returnType: 'Num',
            expr1: NumberLiteral(2),
            expr2: Arithmetic(3, '*', 4),
          },
          expr2: NumberLiteral(5),
        }
      ],
      returnType: 'Num',
    },
    expr2: Arithmetic(6, '/', 7),
  },
  {
    type: 'BinaryOpExpr',
    operator: Op.Slash,
    returnType: 'Num',
    expr1: {
      type: 'FunctionInvokeExpr',
      name: 'funcF',
      params: [
        NumberLiteral(1),
        {
          type: 'BinaryOpExpr',
          operator: Op.Plus,
          returnType: 'Num',
          expr1: NumberLiteral(2),
          expr2: {
            type: 'BinaryOpExpr',
            operator: Op.Asterisk,
            returnType: 'Num',
            expr1: NumberLiteral(3),
            expr2: prioritize(Arithmetic(4, '/', 5)),
          },
        },
      ],
      returnType: 'Num',
    },
    expr2: prioritize(Arithmetic(6, '-', 7)),
  },
  {
    type: 'BinaryOpExpr',
    operator: Op.Dash,
    returnType: 'Num',
    expr1: {
      type: 'BinaryOpExpr',
      operator: Op.Plus,
      returnType: 'Num',
      expr1: NumberLiteral(1),
      expr2: {
        type: 'BinaryOpExpr',
        operator: Op.Slash,
        returnType: 'Num',
        expr1: {
          type: 'BinaryOpExpr',
          operator: Op.Asterisk,
          returnType: 'Num',
          expr1: NumberLiteral(2),
          expr2: {
            type: 'FunctionInvokeExpr',
            name: 'funcG',
            params: [
              Arithmetic(3, '*', 4),
              NumberLiteral(5),
            ],
            returnType: 'Num',
          },
        },
        expr2: NumberLiteral(6),
      },
    },
    expr2: NumberLiteral(7),
  },
];

const compiled = `\
funcA('Hello world');
funcB(1, 2, 3);
funcC(1, 2 + (3 * 4), 5 / 6 - 7);
funcD(1, 2 + (3 * 4), 5) / 6 - 7;
funcE(1, 2 + (3 * 4) + 5) - (6 / 7);
funcF(1, 2 + (3 * (4 / 5))) / (6 - 7);
1 + (2 * funcG(3 * 4, 5) / 6) - 7;
`;

const minified = 'funcA(\'Hello world\');funcB(1,2,3);funcC(1,2+(3*4),5/6-7);funcD(1,2+(3*4),5)/6-7;funcE(1,2+(3*4)+5)-(6/7);funcF(1,2+(3*(4/5)))/(6-7);1+(2*funcG(3*4,5)/6)-7;';

const parseOptions: ParseOptions = {
  functions: createFunctionPatterns([
    ['funcA', [[['Str'], 'Null']]],
    ['funcB', [[['Num', 'Num', 'Num'], 'Null']]],
    ['funcC', [[['Num', 'Num', 'Num'], 'Null']]],
    ['funcD', [[['Num', 'Num', 'Num'], 'Num']]],
    ['funcE', [[['Num', 'Num'], 'Num']]],
    ['funcF', [[['Num', 'Num'], 'Num']]],
    ['funcG', [[['Num', 'Num'], 'Num']]],
  ]),
};

export {
  program,
  tokens,
  ast,
  compiled,
  parseOptions,
  minified,
};
