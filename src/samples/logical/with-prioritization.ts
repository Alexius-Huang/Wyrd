import { Token, AST } from '../../types';
import { BooleanLiteral, prioritize } from '../helper';
import DT from '../../parser/classes/DataType';

const program = `\
not (False or True) and False
`;

const tokens: Array<Token> = [
  { type: 'keyword', value: 'not' },
  { type: 'lparen', value: '(' },
  { type: 'boolean', value: 'False' },
  { type: 'keyword', value: 'or' },
  { type: 'boolean', value: 'True' },
  { type: 'rparen', value: ')' },
  { type: 'keyword', value: 'and' },
  { type: 'boolean', value: 'False' },
  { type: 'newline', value: '\n' },
];

const ast: AST = [
  {
    type: 'AndExpr',
    return: DT.Bool,
    expr1: {
      type: 'NotExpr',
      return: DT.Bool,
      expr: prioritize({
        type: 'OrExpr',
        return: DT.Bool,
        expr1: BooleanLiteral(false),
        expr2: BooleanLiteral(true),
      }),
    },
    expr2: BooleanLiteral(false)
  },
];

const compiled = `\
!(false || true) && false;
`;

const minified = '!(false||true)&&false;';

export {
  program,
  tokens,
  ast,
  compiled,
  minified,
};
