import { Token, AST } from '../../types';
import { BooleanLiteral } from '../helper';

const program = `\
True and False or not False
not False and True
`;

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
    returnType: 'Bool',
    expr1: {
      type: 'AndExpr',
      returnType: 'Bool',
      expr1: BooleanLiteral(true),
      expr2: BooleanLiteral(false),
    },
    expr2: {
      type: 'NotExpr',
      returnType: 'Bool',
      expr: BooleanLiteral(false),
    },
  },
  {
    type: 'AndExpr',
    returnType: 'Bool',
    expr1: {
      type: 'NotExpr',
      returnType: 'Bool',
      expr: BooleanLiteral(false),
    },
    expr2: BooleanLiteral(true),
  },
];

const compiled = `\
true && false || !(false);
!(false) && true;
`;

export {
  program,
  tokens,
  ast,
  compiled,
};
