import { Token, AST, Operator as Op } from '../types';

const program = `\
(1 + 2) * 3
1 * (2 + 3)
(1 + 2) * (3 + 4)
(1 + (5 - 3)) * (10 / 5)
`;

const tokens: Array<Token> = [
  { type: 'lparen', value: '(' },
  { type: 'number', value: '1' },
  { type: 'plus', value: '+' },
  { type: 'number', value: '2' },
  { type: 'rparen', value: ')' },
  { type: 'asterisk', value: '*' },
  { type: 'number', value: '3' },
  { type: 'newline', value: '\n' },

  { type: 'number', value: '1' },
  { type: 'asterisk', value: '*' },
  { type: 'lparen', value: '(' },
  { type: 'number', value: '2' },
  { type: 'plus', value: '+' },
  { type: 'number', value: '3' },
  { type: 'rparen', value: ')' },
  { type: 'newline', value: '\n' },

  { type: 'lparen', value: '(' },
  { type: 'number', value: '1' },
  { type: 'plus', value: '+' },
  { type: 'number', value: '2' },
  { type: 'rparen', value: ')' },
  { type: 'asterisk', value: '*' },
  { type: 'lparen', value: '(' },
  { type: 'number', value: '3' },
  { type: 'plus', value: '+' },
  { type: 'number', value: '4' },
  { type: 'rparen', value: ')' },
  { type: 'newline', value: '\n' },

  { type: 'lparen', value: '(' },
  { type: 'number', value: '1' },
  { type: 'plus', value: '+' },
  { type: 'lparen', value: '(' },
  { type: 'number', value: '5' },
  { type: 'dash', value: '-' },
  { type: 'number', value: '3' },
  { type: 'rparen', value: ')' },
  { type: 'rparen', value: ')' },
  { type: 'asterisk', value: '*' },
  { type: 'lparen', value: '(' },
  { type: 'number', value: '10' },
  { type: 'slash', value: '/' },
  { type: 'number', value: '5' },
  { type: 'rparen', value: ')' },
];

const ast: AST = [
  {
    type: 'BinaryOpExpr',
    operator: Op.Asterisk,
    returnType: 'Num',
    expr1: {
      type: 'PrioritizedExpr',
      returnType: 'Num',
      expr: {
        type: 'BinaryOpExpr',
        operator: Op.Plus,
        returnType: 'Num',
        expr1: {
          type: 'NumberLiteral',
          value: '1',
          returnType: 'Num',
        },
        expr2: {
          type: 'NumberLiteral',
          value: '2',
          returnType: 'Num',
        },
      }
    },
    expr2: {
      type: 'NumberLiteral',
      value: '3',
      returnType: 'Num',
    },
  },
  {
    type: 'BinaryOpExpr',
    operator: Op.Asterisk,
    returnType: 'Num',
    expr1: {
      type: 'NumberLiteral',
      value: '1',
      returnType: 'Num',
    },
    expr2: {
      type: 'PrioritizedExpr',
      returnType: 'Num',
      expr: {
        type: 'BinaryOpExpr',
        operator: Op.Plus,
        returnType: 'Num',
        expr1: {
          type: 'NumberLiteral',
          value: '2',
          returnType: 'Num',
        },
        expr2: {
          type: 'NumberLiteral',
          value: '3',
          returnType: 'Num',
        },
      },
    },
  },
  {
    type: 'BinaryOpExpr',
    operator: Op.Asterisk,
    returnType: 'Num',
    expr1: {
      type: 'PrioritizedExpr',
      returnType: 'Num',
      expr: {
        type: 'BinaryOpExpr',
        operator: Op.Plus,
        expr1: {
          type: 'NumberLiteral',
          value: '1',
          returnType: 'Num',
        },
        expr2: {
          type: 'NumberLiteral',
          value: '2',
          returnType: 'Num',
        },
      }
    },
    expr2: {
      type: 'PrioritizedExpr',
      returnType: 'Num',
      expr: {
        type: 'BinaryOpExpr',
        operator: Op.Plus,
        expr1: {
          type: 'NumberLiteral',
          value: '3',
          returnType: 'Num',
        },
        expr2: {
          type: 'NumberLiteral',
          value: '4',
          returnType: 'Num',
        },
      },
    },
  },
  {
    type: 'BinaryOpExpr',
    operator: Op.Asterisk,
    returnType: 'Num',
    expr1: {
      type: 'PrioritizedExpr',
      returnType: 'Num',
      expr: {
        type: 'BinaryOpExpr',
        operator: Op.Plus,
        returnType: 'Num',
        expr1: {
          type: 'NumberLiteral',
          value: '1',
          returnType: 'Num',
        },
        expr2: {
          type: 'PrioritizedExpr',
          returnType: 'Num',
          expr: {
            type: 'BinaryOpExpr',
            operator: Op.Dash,
            returnType: 'Num',
            expr1: {
              type: 'NumberLiteral',
              value: '5',
              returnType: 'Num',
            },
            expr2: {
              type: 'NumberLiteral',
              value: '3',
              returnType: 'Num',
            },
          }
        }
      }
    },
    expr2: {
      type: 'PrioritizedExpr',
      returnType: 'Num',
      expr: {
        type: 'BinaryOpExpr',
        operator: Op.Slash,
        returnType: 'Num',
        expr1: {
          type: 'NumberLiteral',
          value: '10',
          returnType: 'Num',
        },
        expr2: {
          type: 'NumberLiteral',
          value: '5',
          returnType: 'Num',
        },
      }
    }
  }
];

const compiled = `\
(1 + 2) * 3;
1 * (2 + 3);
(1 + 2) * (3 + 4);
(1 + (5 - 3)) * (10 / 5);
`;

export {
  program,
  tokens,
  ast,
  compiled,
};
