import { Token, AST } from '../../types';
import { BooleanLiteral } from '../helper';
import { DataType as DT } from '../../parser/utils';

const tokens: Array<Token> = [
  { type: 'boolean', value: 'True' },
  { type: 'keyword', value: 'and' },
  { type: 'boolean', value: 'False' },
  { type: 'keyword', value: 'or' },
  { type: 'keyword', value: 'not' },
  { type: 'boolean', value: 'False' },
  { type: 'newline', value: '\n' },

  { type: 'keyword', value: 'not' },
  { type: 'boolean', value: 'False' },
  { type: 'keyword', value: 'and' },
  { type: 'boolean', value: 'True' },
  { type: 'newline', value: '\n' },
];

const ast: AST = [
  {
    type: 'OrExpr',
    return: DT.Bool,
    expr1: {
      type: 'AndExpr',
      return: DT.Bool,
      expr1: BooleanLiteral(true),
      expr2: BooleanLiteral(false),
    },
    expr2: {
      type: 'NotExpr',
      return: DT.Bool,
      expr: BooleanLiteral(false),
    },
  },
  {
    type: 'AndExpr',
    return: DT.Bool,
    expr1: {
      type: 'NotExpr',
      return: DT.Bool,
      expr: BooleanLiteral(false),
    },
    expr2: BooleanLiteral(true),
  },
];

const compiled = `\
true && false || !(false);
!(false) && true;
`;

const minified = 'true&&false||!(false);!(false)&&true;'

export {
  tokens,
  ast,
  compiled,
  minified,
};
