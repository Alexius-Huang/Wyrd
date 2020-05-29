import { Token, AST, Operator as Op, CompilerOptions } from '../../types';
import { DataType as DT, Parameter, Scope } from '../../parser/utils';
import { NumberLiteral } from '../helper';

const tokens: Array<Token> = [
  { type: 'ident', value: 'funcA' },
  { type: 'lparen', value: '(' },
  { type: 'number', value: '1' },
  { type: 'comma', value: ',' },
  { type: 'ident', value: 'funcB' },
  { type: 'lparen', value: '(' },
  { type: 'number', value: '2' },
  { type: 'comma', value: ',' },
  { type: 'number', value: '3' },
  { type: 'comma', value: ',' },
  { type: 'number', value: '4' },
  { type: 'comma', value: ',' },
  { type: 'number', value: '5' },
  { type: 'rparen', value: ')' },
  { type: 'rparen', value: ')' },
  { type: 'newline', value: '\n' },

  { type: 'ident', value: 'funcC' },
  { type: 'lparen', value: '(' },
  { type: 'number', value: '1' },
  { type: 'comma', value: ',' },
  { type: 'number', value: '2' },
  { type: 'comma', value: ',' },
  { type: 'ident', value: 'funcD' },
  { type: 'lparen', value: '(' },
  { type: 'number', value: '3' },
  { type: 'comma', value: ',' },
  { type: 'number', value: '4' },
  { type: 'rparen', value: ')' },
  { type: 'comma', value: ',' },
  { type: 'number', value: '5' },
  { type: 'rparen', value: ')' },
  { type: 'newline', value: '\n' },

  { type: 'ident', value: 'funcE' },
  { type: 'lparen', value: '(' },
  { type: 'number', value: '1' },
  { type: 'comma', value: ',' },
  { type: 'ident', value: 'funcF' },
  { type: 'lparen', value: '(' },
  { type: 'number', value: '2' },
  { type: 'comma', value: ',' },
  { type: 'number', value: '3' },
  { type: 'comma', value: ',' },
  { type: 'ident', value: 'funcG' },
  { type: 'lparen', value: '(' },
  { type: 'number', value: '4' },
  { type: 'rparen', value: ')' },
  { type: 'rparen', value: ')' },
  { type: 'comma', value: ',' },
  { type: 'number', value: '5' },
  { type: 'rparen', value: ')' },
  { type: 'newline', value: '\n' },

  { type: 'ident', value: 'funcH' },
  { type: 'lparen', value: '(' },
  { type: 'ident', value: 'funcI' },
  { type: 'lparen', value: '(' },
  { type: 'number', value: '1' },
  { type: 'rparen', value: ')' },
  { type: 'plus', value: '+' },
  { type: 'number', value: '2' },
  { type: 'asterisk', value: '*' },
  { type: 'ident', value: 'funcJ' },
  { type: 'lparen', value: '(' },
  { type: 'number', value: '3' },
  { type: 'comma', value: ',' },
  { type: 'number', value: '4' },
  { type: 'rparen', value: ')' },
  { type: 'comma', value: ',' },
  { type: 'ident', value: 'funcK' },
  { type: 'lparen', value: '(' },
  { type: 'number', value: '5' },
  { type: 'rparen', value: ')' },
  { type: 'rparen', value: ')' },
  { type: 'newline', value: '\n' },

  { type: 'ident', value: 'funcL' },
  { type: 'lparen', value: '(' },
  { type: 'ident', value: 'funcM' },
  { type: 'lparen', value: '(' },
  { type: 'number', value: '1' },
  { type: 'rparen', value: ')' },
  { type: 'asterisk', value: '*' },
  { type: 'number', value: '2' },
  { type: 'plus', value: '+' },
  { type: 'number', value: '3' },
  { type: 'asterisk', value: '*' },
  { type: 'ident', value: 'funcN' },
  { type: 'lparen', value: '(' },
  { type: 'number', value: '4' },
  { type: 'rparen', value: ')' },
  { type: 'dash', value: '-' },
  { type: 'number', value: '5' },
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
        type: 'FunctionInvokeExpr',
        name: 'funcB',
        params: [
          NumberLiteral(2),
          NumberLiteral(3),
          NumberLiteral(4),
          NumberLiteral(5),
        ],
        return: DT.Num,
      },
    ],
    return: DT.Num,
  },
  {
    type: 'FunctionInvokeExpr',
    name: 'funcC',
    params: [
      NumberLiteral(1),
      NumberLiteral(2),
      {
        type: 'FunctionInvokeExpr',
        name: 'funcD',
        params: [
          NumberLiteral(3),
          NumberLiteral(4),
        ],
        return: DT.Num,
      },    
      NumberLiteral(5),
    ],
    return: DT.Num,
  },
  {
    type: 'FunctionInvokeExpr',
    name: 'funcE',
    params: [
      NumberLiteral(1),
      {
        type: 'FunctionInvokeExpr',
        name: 'funcF',
        params: [
          NumberLiteral(2),
          NumberLiteral(3),
          {
            type: 'FunctionInvokeExpr',
            name: 'funcG',
            params: [
              NumberLiteral(4),
            ],
            return: DT.Num,
          },    
        ],
        return: DT.Num,
      },    
      NumberLiteral(5),
    ],
    return: DT.Num,
  },
  {
    type: 'FunctionInvokeExpr',
    name: 'funcH',
    params: [
      {
        type: 'BinaryOpExpr',
        operator: Op.Plus,
        return: DT.Num,
        expr1: {
          type: 'FunctionInvokeExpr',
          name: 'funcI',
          params: [
            NumberLiteral(1),
          ],
          return: DT.Num,
        },
        expr2: {
          type: 'BinaryOpExpr',
          operator: Op.Asterisk,
          return: DT.Num,
          expr1: NumberLiteral(2),
          expr2: {
            type: 'FunctionInvokeExpr',
            name: 'funcJ',
            params: [
              NumberLiteral(3),
              NumberLiteral(4),
            ],
            return: DT.Num,
          }
        }
      },
      {
        type: 'FunctionInvokeExpr',
        name: 'funcK',
        params: [
          NumberLiteral(5),
        ],
        return: DT.Num,
      },
    ],
    return: DT.Num,
  },
  {
    type: 'FunctionInvokeExpr',
    name: 'funcL',
    params: [
      {
        type: 'BinaryOpExpr',
        operator: Op.Dash,
        return: DT.Num,
        expr1: {
          type: 'BinaryOpExpr',
          operator: Op.Plus,
          return: DT.Num,
          expr1: {
            type: 'BinaryOpExpr',
            operator: Op.Asterisk,
            return: DT.Num,
            expr1: {
              type: 'FunctionInvokeExpr',
              name: 'funcM',
              params: [
                NumberLiteral(1),
              ],
              return: DT.Num,
            },
            expr2: NumberLiteral(2),
          },
          expr2: {
            type: 'BinaryOpExpr',
            operator: Op.Asterisk,
            return: DT.Num,
            expr1: NumberLiteral(3),
            expr2: {
              type: 'FunctionInvokeExpr',
              name: 'funcN',
              params: [
                NumberLiteral(4),
              ],
              return: DT.Num,
            },      
          },
        },
        expr2: NumberLiteral(5),
      },
    ],
    return: DT.Num,
  },
];

const compiled = `\
funcA(1, funcB(2, 3, 4, 5));
funcC(1, 2, funcD(3, 4), 5);
funcE(1, funcF(2, 3, funcG(4)), 5);
funcH(funcI(1) + (2 * funcJ(3, 4)), funcK(5));
funcL(funcM(1) * 2 + (3 * funcN(4)) - 5);
`;

const minified = 'funcA(1,funcB(2,3,4,5));funcC(1,2,funcD(3,4),5);funcE(1,funcF(2,3,funcG(4)),5);funcH(funcI(1)+(2*funcJ(3,4)),funcK(5));funcL(funcM(1)*2+(3*funcN(4))-5);';

const scope = (s: Scope): Scope => {
  const funcA = s.createFunction('funcA');
  funcA.createNewPattern(Parameter.of(DT.Num, DT.Num), DT.Num);
  const funcB = s.createFunction('funcB');
  funcB.createNewPattern(Parameter.of(DT.Num, DT.Num, DT.Num, DT.Num), DT.Num);
  const funcC = s.createFunction('funcC');
  funcC.createNewPattern(Parameter.of(DT.Num, DT.Num, DT.Num, DT.Num), DT.Num);
  const funcD = s.createFunction('funcD');
  funcD.createNewPattern(Parameter.of(DT.Num, DT.Num), DT.Num);
  const funcE = s.createFunction('funcE');
  funcE.createNewPattern(Parameter.of(DT.Num, DT.Num, DT.Num), DT.Num);
  const funcF = s.createFunction('funcF');
  funcF.createNewPattern(Parameter.of(DT.Num, DT.Num, DT.Num), DT.Num);
  const funcG = s.createFunction('funcG');
  funcG.createNewPattern(Parameter.of(DT.Num), DT.Num);
  const funcH = s.createFunction('funcH');
  funcH.createNewPattern(Parameter.of(DT.Num, DT.Num), DT.Num);
  const funcI = s.createFunction('funcI');
  funcI.createNewPattern(Parameter.of(DT.Num), DT.Num);
  const funcJ = s.createFunction('funcJ');
  funcJ.createNewPattern(Parameter.of(DT.Num, DT.Num), DT.Num);
  const funcK = s.createFunction('funcK');
  funcK.createNewPattern(Parameter.of(DT.Num), DT.Num);
  const funcL = s.createFunction('funcL');
  funcL.createNewPattern(Parameter.of(DT.Num), DT.Num);
  const funcM = s.createFunction('funcM');
  funcM.createNewPattern(Parameter.of(DT.Num), DT.Num);
  const funcN = s.createFunction('funcN');
  funcN.createNewPattern(Parameter.of(DT.Num), DT.Num);
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
