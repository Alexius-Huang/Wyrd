import { Token, AST, Operator as Op, CompilerOptions } from '../../types';
import { DataType as DT, Scope, Parameter } from '../../parser/utils';
import { prioritize, NumberLiteral } from '../helper';

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
      NumberLiteral(1),
      {
        type: 'BinaryOpExpr',
        operator: Op.Asterisk,
        return: DT.Num,
        expr1: prioritize({
          type: 'BinaryOpExpr',
          operator: Op.Plus,
          return: DT.Num,
          expr1: {
            type: 'FunctionInvokeExpr',
            name: 'funcB',
            params: [
              NumberLiteral(2),
              NumberLiteral(3)
            ],
            return: DT.Num,
          },
          expr2: NumberLiteral(4),
        }),
        expr2: {
          type: 'FunctionInvokeExpr',
          name: 'funcC',
          params: [
            NumberLiteral(5),
          ],
          return: DT.Num
        },
      },
    ],
    return: DT.Num,
  },
  {
    type: 'FunctionInvokeExpr',
    name: 'funcD',
    params: [
      {
        type: 'BinaryOpExpr',
        operator: Op.Slash,
        return: DT.Num,
        expr1: NumberLiteral(1),
        expr2: prioritize({
          type: 'BinaryOpExpr',
          operator: Op.Dash,
          return: DT.Num,
          expr1: {
            type: 'FunctionInvokeExpr',
            name: 'funcE',
            params: [
              NumberLiteral(2),
              NumberLiteral(3),
            ],
            return: DT.Num,
          },
          expr2: NumberLiteral(4),
        }),
      },
      NumberLiteral(5),
    ],
    return: DT.Num,
  },
  {
    type: 'FunctionInvokeExpr',
    name: 'funcF',
    params: [
      {
        type: 'BinaryOpExpr',
        operator: Op.Slash,
        return: DT.Num,
        expr1: prioritize({
          type: 'BinaryOpExpr',
          operator: Op.Dash,
          return: DT.Num,
          expr1: NumberLiteral(1),
          expr2: {
            type: 'BinaryOpExpr',
            operator: Op.Asterisk,
            return: DT.Num,
            expr1: {
              type: 'FunctionInvokeExpr',
              name: 'funcG',
              params: [
                NumberLiteral(2),
              ],
              return: DT.Num,
            },
            expr2: NumberLiteral(3),
          },
        }),
        expr2: NumberLiteral(4),
      },
      {
        type: 'FunctionInvokeExpr',
        name: 'funcH',
        params: [
          NumberLiteral(5),
        ],
        return: DT.Num,
      },
    ],
    return: DT.Num,
  },
];

const compiled = `\
funcA(1, (funcB(2, 3) + 4) * funcC(5));
funcD(1 / (funcE(2, 3) - 4), 5);
funcF((1 - (funcG(2) * 3)) / 4, funcH(5));
`;

const minified = 'funcA(1,(funcB(2,3)+4)*funcC(5));funcD(1/(funcE(2,3)-4),5);funcF((1-(funcG(2)*3))/4,funcH(5));';

const scope = (s: Scope): Scope => {
  const funcA = s.createFunction('funcA');
  funcA.createNewPattern(Parameter.of(DT.Num, DT.Num), DT.Num);
  const funcB = s.createFunction('funcB');
  funcB.createNewPattern(Parameter.of(DT.Num, DT.Num), DT.Num);
  const funcC = s.createFunction('funcC');
  funcC.createNewPattern(Parameter.of(DT.Num), DT.Num);
  const funcD = s.createFunction('funcD');
  funcD.createNewPattern(Parameter.of(DT.Num, DT.Num), DT.Num);
  const funcE = s.createFunction('funcE');
  funcE.createNewPattern(Parameter.of(DT.Num, DT.Num), DT.Num);
  const funcF = s.createFunction('funcF');
  funcF.createNewPattern(Parameter.of(DT.Num, DT.Num), DT.Num);
  const funcG = s.createFunction('funcG');
  funcG.createNewPattern(Parameter.of(DT.Num), DT.Num);
  const funcH = s.createFunction('funcH');
  funcH.createNewPattern(Parameter.of(DT.Num), DT.Num);
  return s;  
};

const compilerOptions: CompilerOptions = { scopeMiddleware: scope };

export {
  tokens,
  ast,
  compiled,
  compilerOptions,
  minified,
};
