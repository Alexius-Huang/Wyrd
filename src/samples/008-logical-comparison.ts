import { Token, AST, Operator as Op, WyrdPrimitives as WP } from '../types';

const program = `\
3 + 1 > 2
5 * 3 < 15 - 6 * 8
11 >= 7 + 7 or 3 <= (6 + 2) / 3
8 / (4 * 2) > 3 and not 1 + 2 * 3 == 7 or a + b / c * d != w - x * y
`;

const tokens: Array<Token> = [
  { type: 'number', value: '3' },
  { type: 'plus', value: '+' },
  { type: 'number', value: '1' },
  { type: 'gt', value: '>' },
  { type: 'number', value: '2' },
  { type: 'newline', value: '\n' },

  { type: 'number', value: '5' },
  { type: 'asterisk', value: '*' },
  { type: 'number', value: '3' },
  { type: 'lt', value: '<' },
  { type: 'number', value: '15' },
  { type: 'dash', value: '-' },
  { type: 'number', value: '6' },
  { type: 'asterisk', value: '*' },
  { type: 'number', value: '8' },
  { type: 'newline', value: '\n' },

  { type: 'number', value: '11' },
  { type: 'gteq', value: '>=' },
  { type: 'number', value: '7' },
  { type: 'plus', value: '+' },
  { type: 'number', value: '7' },
  { type: 'keyword', value: 'or' },
  { type: 'number', value: '3' },
  { type: 'lteq', value: '<=' },
  { type: 'lparen', value: '(' },
  { type: 'number', value: '6' },
  { type: 'plus', value: '+' },
  { type: 'number', value: '2' },
  { type: 'rparen', value: ')' },
  { type: 'slash', value: '/' },
  { type: 'number', value: '3' },
  { type: 'newline', value: '\n' },

  { type: 'number', value: '8' },
  { type: 'slash', value: '/' },
  { type: 'lparen', value: '(' },
  { type: 'number', value: '4' },
  { type: 'asterisk', value: '*' },
  { type: 'number', value: '2' },
  { type: 'rparen', value: ')' },
  { type: 'gt', value: '>' },
  { type: 'number', value: '3' },
  { type: 'keyword', value: 'and' },
  { type: 'keyword', value: 'not' },
  { type: 'number', value: '1' },
  { type: 'plus', value: '+' },
  { type: 'number', value: '2' },
  { type: 'asterisk', value: '*' },
  { type: 'number', value: '3' },
  { type: 'eqeq', value: '==' },
  { type: 'number', value: '7' },
  { type: 'keyword', value: 'or' },
  { type: 'ident', value: 'a' },
  { type: 'plus', value: '+' },
  { type: 'ident', value: 'b' },
  { type: 'slash', value: '/' },
  { type: 'ident', value: 'c' },
  { type: 'asterisk', value: '*' },
  { type: 'ident', value: 'd' },
  { type: 'bangeq', value: '!=' },
  { type: 'ident', value: 'w' },
  { type: 'dash', value: '-' },
  { type: 'ident', value: 'x' },
  { type: 'asterisk', value: '*' },
  { type: 'ident', value: 'y' },
];

const ast: AST = [
  {
    type: 'BinaryOpExpr',
    operator: Op.Gt,
    expr1: {
      type: 'BinaryOpExpr',
      operator: Op.Plus,
      expr1: { type: 'NumberLiteral', value: '3', returnType: WP.Num },
      expr2: { type: 'NumberLiteral', value: '1', returnType: WP.Num }
    },
    expr2: { type: 'NumberLiteral', value: '2', returnType: WP.Num }
  },
  {
    type: 'BinaryOpExpr',
    operator: Op.Lt,
    expr1: {
      type: 'BinaryOpExpr',
      operator: Op.Asterisk,
      expr1: { type: 'NumberLiteral', value: '5', returnType: WP.Num },
      expr2: { type: 'NumberLiteral', value: '3', returnType: WP.Num }
    },
    expr2: {
      type: 'BinaryOpExpr',
      operator: Op.Dash,
      expr1: { type: 'NumberLiteral', value: '15', returnType: WP.Num },
      expr2: {
        type: 'BinaryOpExpr',
        operator: Op.Asterisk,
        expr1: { type: 'NumberLiteral', value: '6', returnType: WP.Num },
        expr2: { type: 'NumberLiteral', value: '8', returnType: WP.Num },
      },
    },
  },
  {
    type: 'OrExpr',
    expr1: {
      type: 'BinaryOpExpr',
      operator: Op.GtEq,
      expr1: { type: 'NumberLiteral', value: '11', returnType: WP.Num },
      expr2: {
        type: 'BinaryOpExpr',
        operator: Op.Plus,
        expr1: { type: 'NumberLiteral', value: '7', returnType: WP.Num },
        expr2: { type: 'NumberLiteral', value: '7', returnType: WP.Num },
      },
    },
    expr2: {
      type: 'BinaryOpExpr',
      operator: Op.LtEq,
      expr1: { type: 'NumberLiteral', value: '3', returnType: WP.Num },
      expr2: {
        type: 'BinaryOpExpr',
        operator: Op.Slash,
        expr1: {
          type: 'PrioritizedExpr',
          expr: {
            type: 'BinaryOpExpr',
            operator: Op.Plus,
            expr1: { type: 'NumberLiteral', value: '6', returnType: WP.Num },
            expr2: { type: 'NumberLiteral', value: '2', returnType: WP.Num },
          },
        },
        expr2: { type: 'NumberLiteral', value: '3', returnType: WP.Num }, 
      },
    },
  },
  {
    type: 'OrExpr',
    expr1: {
      type: 'AndExpr',
      expr1: {
        type: 'BinaryOpExpr',
        operator: Op.Gt,
        expr1: {
          type: 'BinaryOpExpr',
          operator: Op.Slash,
          expr1: { type: 'NumberLiteral', value: '8', returnType: WP.Num },
          expr2: {
            type: 'PrioritizedExpr',
            expr: {
              type: 'BinaryOpExpr',
              operator: Op.Asterisk,
              expr1: { type: 'NumberLiteral', value: '4', returnType: WP.Num },
              expr2: { type: 'NumberLiteral', value: '2', returnType: WP.Num },
            },
          },
        },
        expr2: { type: 'NumberLiteral', value: '3', returnType: WP.Num }
      },
      expr2: {
        type: 'NotExpr',
        expr: {
          type: 'BinaryOpExpr',
          operator: Op.EqEq,
          expr1: {
            type: 'BinaryOpExpr',
            operator: Op.Plus,
            expr1: { type: 'NumberLiteral', value: '1', returnType: WP.Num },
            expr2: {
              type: 'BinaryOpExpr',
              operator: Op.Asterisk,
              expr1: { type: 'NumberLiteral', value: '2', returnType: WP.Num },
              expr2: { type: 'NumberLiteral', value: '3', returnType: WP.Num }
            },
          },
          expr2: { type: 'NumberLiteral', value: '7', returnType: WP.Num }
        },
      },
    },
    expr2: {
      type: 'BinaryOpExpr',
      operator: Op.BangEq,
      expr1: {
        type: 'BinaryOpExpr',
        operator: Op.Plus,
        expr1: { type: 'IdentLiteral', value: 'a' },
        expr2: {
          type: 'BinaryOpExpr',
          operator: Op.Asterisk,
          expr1: {
            type: 'BinaryOpExpr',
            operator: Op.Slash,
            expr1: { type: 'IdentLiteral', value: 'b' },
            expr2: { type: 'IdentLiteral', value: 'c' },
          },
          expr2: { type: 'IdentLiteral', value: 'd' },
        },
      },
      expr2: {
        type: 'BinaryOpExpr',
        operator: Op.Dash,
        expr1: { type: 'IdentLiteral', value: 'w' },
        expr2: {
          type: 'BinaryOpExpr',
          operator: Op.Asterisk,
          expr1: { type: 'IdentLiteral', value: 'x' },
          expr2: { type: 'IdentLiteral', value: 'y' },
        },
      },
    },
  },
];

const compiled = `\
3 + 1 > 2;
5 * 3 < 15 - (6 * 8);
11 >= 7 + 7 || 3 <= (6 + 2) / 3;
8 / (4 * 2) > 3 && !(1 + (2 * 3) === 7) || a + (b / c * d) !== w - (x * y);
`;

export {
  program,
  tokens,
  ast,
  compiled,
};
