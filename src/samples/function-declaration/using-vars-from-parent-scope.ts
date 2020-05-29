import { Token, AST, Operator as Op } from '../../types';
import { NumberLiteral, Var, Arithmetic } from '../helper';
import { DataType as DT } from '../../parser/utils';

const tokens: Array<Token> = [
  { type: 'keyword', value: 'mutable' },
  { type: 'ident', value: 'something' },
  { type: 'eq', value: '=' },
  { type: 'number', value: '1' },
  { type: 'newline', value: '\n' },

  { type: 'keyword', value: 'def' },
  { type: 'ident', value: 'addSomething' },
  { type: 'lparen', value: '(' },
  { type: 'ident', value: 'x' },
  { type: 'colon', value: ':' },
  { type: 'builtin-type', value: 'Num' },
  { type: 'rparen', value: ')' },
  { type: 'colon', value: ':' },
  { type: 'builtin-type', value: 'Num' },
  { type: 'arrow', value: '=>' },
  { type: 'ident', value: 'x' },
  { type: 'plus', value: '+' },
  { type: 'ident', value: 'something' },
  { type: 'newline', value: '\n' },

  { type: 'ident', value: 'something' },
  { type: 'eq', value: '=' },
  { type: 'number', value: '2' },
  { type: 'newline', value: '\n' },
  { type: 'newline', value: '\n' },

  { type: 'keyword', value: 'def' },
  { type: 'ident', value: 'complexArithmetics' },
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
  { type: 'ident', value: 'a' },
  { type: 'eq', value: '=' },
  { type: 'ident', value: 'x' },
  { type: 'plus', value: '+' },
  { type: 'ident', value: 'y' },
  { type: 'newline', value: '\n' },
  { type: 'ident', value: 'b' },
  { type: 'eq', value: '=' },
  { type: 'ident', value: 'a' },
  { type: 'asterisk', value: '*' },
  { type: 'ident', value: 'something' },
  { type: 'plus', value: '+' },
  { type: 'ident', value: 'y' },
  { type: 'newline', value: '\n' },
  { type: 'ident', value: 'b' },
  { type: 'newline', value: '\n' },
  { type: 'keyword', value: 'end' },
  { type: 'newline', value: '\n' },
];

const ast: AST = [
  {
    type: 'VarDeclaration',
    return: DT.Void,
    expr1: Var('something', DT.Num),
    expr2: NumberLiteral(1)
  },
  {
    type: 'FunctionDeclaration',
    name: 'addSomething',
    arguments: [
      { ident: 'x', type: DT.Num },
    ],
    outputType: DT.Num,
    body: [
      Arithmetic('x', '+', 'something'),
    ],
    return: DT.Void,
  },
  {
    type: 'VarAssignmentExpr',
    return: DT.Void,
    expr1: Var('something', DT.Num),
    expr2: NumberLiteral(2),
  },
  {
    type: 'FunctionDeclaration',
    name: 'complexArithmetics',
    arguments: [
      { ident: 'x', type: DT.Num },
      { ident: 'y', type: DT.Num },
    ],
    outputType: DT.Num,
    body: [
      {
        type: 'AssignmentExpr',
        return: DT.Void,
        expr1: Var('a', DT.Num),
        expr2: Arithmetic('x', '+', 'y'),
      },
      {
        type: 'AssignmentExpr',
        return: DT.Void,
        expr1: Var('b', DT.Num),
        expr2: {
          type: 'BinaryOpExpr',
          operator: Op.Plus,
          return: DT.Num,
          expr1: Arithmetic('a', '*', 'something'),
          expr2: Var('y', DT.Num),
        },
      },
      Var('b', DT.Num),
    ],
    return: DT.Void,
  }
];

const compiled = `\
let something = 1;
function addSomething(x) {
  return x + something;
}

something = 2;
function complexArithmetics(x, y) {
  const a = x + y;
  const b = a * something + y;
  return b;
}

`;

const minified = 'let something=1;function addSomething(x){return x+something;}something=2;function complexArithmetics(x,y){const a=x+y;const b=a*something+y;return b;}';

export {
  tokens,
  ast,
  compiled,
  minified,
};
