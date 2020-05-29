import { Token, AST, Operator as Op } from '../../types';
import { NumberLiteral, StringLiteral, BooleanLiteral } from '../helper';
import { DataType as DT } from '../../parser/utils';

const tokens: Array<Token> = [
  { type: 'string', value: '123' },
  { type: 'eqeq', value: '==' },
  { type: 'number', value: '123' },
  { type: 'dot', value: '.' },
  { type: 'ident', value: 'toStr' },
  { type: 'lparen', value: '(' },
  { type: 'rparen', value: ')' },
  { type: 'keyword', value: 'and' },
  { type: 'boolean', value: 'True' },
  { type: 'dot', value: '.' },
  { type: 'ident', value: 'toStr' },
  { type: 'lparen', value: '(' },
  { type: 'rparen', value: ')' },
  { type: 'bangeq', value: '!=' },
  { type: 'string', value: 'False' },
  { type: 'newline', value: '\n' },
];

const ast: AST = [
  {
    type: 'AndExpr',
    return: DT.Bool,
    expr1: {
      type: 'BinaryOpExpr',
      operator: Op.EqEq,
      return: DT.Bool,
      expr1: StringLiteral('123'),
      expr2: {
        type: 'MethodInvokeExpr',
        name: 'toString',
        receiver: NumberLiteral(123),
        params: [],
        return: DT.Str,
      },
    },
    expr2: {
      type: 'BinaryOpExpr',
      operator: Op.BangEq,
      return: DT.Bool,
      expr1: {
        type: 'MethodInvokeExpr',
        name: 'toString',
        receiver: BooleanLiteral(true),
        params: [],
        return: DT.Str,
      },
      expr2: StringLiteral('False'),
    },
  },
];

const compiled = `\
'123' === (123).toString() && (true).toString() !== 'False';
`;

const minified = '\'123\'===(123).toString()&&(true).toString()!==\'False\';';

export {
  tokens,
  ast,
  compiled,
  minified,
};
