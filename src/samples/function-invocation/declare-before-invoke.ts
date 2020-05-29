import { Token, AST } from '../../types';
import { Arithmetic } from '../helper';
import { NumberLiteral } from '../helper';
import { DataType as DT } from '../../parser/utils';

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

  { type: 'ident', value: 'addition' },
  { type: 'lparen', value: '(' },
  { type: 'number', value: '1' },
  { type: 'comma', value: ',' },
  { type: 'number', value: '2' },
  { type: 'rparen', value: ')' },
  { type: 'newline', value: '\n' },
];

const ast: AST = [
  {
    type: 'FunctionDeclaration',
    name: 'addition',
    return: DT.Void,
    arguments: [
      { ident: 'x', type: DT.Num },
      { ident: 'y', type: DT.Num }
    ],
    outputType: DT.Num,
    body: [
      Arithmetic('x', '+', 'y'),
    ],
  },
  {
    type: 'FunctionInvokeExpr',
    name: 'addition',
    params: [
      NumberLiteral(1),
      NumberLiteral(2),
    ],
    return: DT.Num,
  },
];

const compiled = `\
function addition(x, y) {
  return x + y;
}

addition(1, 2);
`;

const minified = 'function addition(x,y){return x+y;}addition(1,2);';

export {
  tokens,
  ast,
  compiled,
  minified,
};
