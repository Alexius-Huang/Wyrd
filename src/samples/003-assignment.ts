import { Token, AST, Operator as Op, WyrdPrimitives as WP } from '../types';

const program = `\
foo = 1
bar = 1 + 2 * 3 + 4
baz = 1 + (2 - 3) * 4
`;

const tokens: Array<Token> = [
  { type: 'ident', value: 'foo' },
  { type: 'eq', value: '=' },
  { type: 'number', value: '1' },
  { type: 'newline', value: '\n' },

  { type: 'ident', value: 'bar' },
  { type: 'eq', value: '=' },
  { type: 'number', value: '1' },
  { type: 'plus', value: '+' },
  { type: 'number', value: '2' },
  { type: 'asterisk', value: '*' },
  { type: 'number', value: '3' },
  { type: 'plus', value: '+' },
  { type: 'number', value: '4' },
  { type: 'newline', value: '\n' },

  { type: 'ident', value: 'baz' },
  { type: 'eq', value: '=' },
  { type: 'number', value: '1' },
  { type: 'plus', value: '+' },
  { type: 'lparen', value: '(' },
  { type: 'number', value: '2' },
  { type: 'dash', value: '-' },
  { type: 'number', value: '3' },
  { type: 'rparen', value: ')' },
  { type: 'asterisk', value: '*' },
  { type: 'number', value: '4' },
  { type: 'newline', value: '\n' },
];

const ast: AST = [
  {
    type: 'AssignmentExpr',
    expr1: {
      type: 'IdentLiteral',
      value: 'foo'
    },
    expr2: {
      type: 'NumberLiteral',
      value: '1',
      returnType: WP.Num,
    },
  },
  {
    type: 'AssignmentExpr',
    expr1: {
      type: 'IdentLiteral',
      value: 'bar'
    },
    expr2: {
      type: 'BinaryOpExpr',
      operator: Op.Plus,
      expr1: {
        type: 'BinaryOpExpr',
        operator: Op.Plus,
        expr1: {
          type: 'NumberLiteral',
          value: '1',
          returnType: WP.Num,
        },
        expr2: {
          type: 'BinaryOpExpr',
          operator: Op.Asterisk,
          expr1: {
            type: 'NumberLiteral',
            value: '2',
            returnType: WP.Num,
          },
          expr2: {
            type: 'NumberLiteral',
            value: '3',
            returnType: WP.Num,
          }
        },
      },
      expr2: {
        type: 'NumberLiteral',
        value: '4',
        returnType: WP.Num,
      },
    },
  },
  {
    type: 'AssignmentExpr',
    expr1: {
      type: 'IdentLiteral',
      value: 'baz',
    },
    expr2: {
      type: 'BinaryOpExpr',
      operator: Op.Plus,
      expr1: {
        type: 'NumberLiteral',
        value: '1',
        returnType: WP.Num,
      },
      expr2: {
        type: 'BinaryOpExpr',
        operator: Op.Asterisk,
        expr1: {
          type: 'PrioritizedExpr',
          expr: {
            type: 'BinaryOpExpr',
            operator: Op.Dash,
            expr1: {
              type: 'NumberLiteral',
              value: '2',
              returnType: WP.Num,
            },
            expr2: {
              type: 'NumberLiteral',
              value: '3',
              returnType: WP.Num,
            }
          },  
        },
        expr2: {
          type: 'NumberLiteral',
          value: '4',
          returnType: WP.Num,
        },
      },
    },
  },
];

const compiled = `\
const foo = 1;
const bar = 1 + (2 * 3) + 4;
const baz = 1 + ((2 - 3) * 4);
`;

export {
  program,
  tokens,
  ast,
  compiled,
};
