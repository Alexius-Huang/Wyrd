import { Token, AST, Operator as Op } from '../../types';

const program = `\
1 + 2 * 3
1 * 2 + 3
1 + 2 * 3 + 4
1 * 2 + 3 * 4
1 + 2 * 3 * 4
1 * 2 + 3 + 4
`;

const tokens: Array<Token> = [
  { type: 'number', value: '1' },
  { type: 'plus', value: '+' },
  { type: 'number', value: '2' },
  { type: 'asterisk', value: '*' },
  { type: 'number', value: '3' },
  { type: 'newline', value: '\n' },

  { type: 'number', value: '1' },
  { type: 'asterisk', value: '*' },
  { type: 'number', value: '2' },
  { type: 'plus', value: '+' },
  { type: 'number', value: '3' },
  { type: 'newline', value: '\n' },

  { type: 'number', value: '1' },
  { type: 'plus', value: '+' },
  { type: 'number', value: '2' },
  { type: 'asterisk', value: '*' },
  { type: 'number', value: '3' },
  { type: 'plus', value: '+' },
  { type: 'number', value: '4' },
  { type: 'newline', value: '\n' },

  { type: 'number', value: '1' },
  { type: 'asterisk', value: '*' },
  { type: 'number', value: '2' },
  { type: 'plus', value: '+' },
  { type: 'number', value: '3' },
  { type: 'asterisk', value: '*' },
  { type: 'number', value: '4' },
  { type: 'newline', value: '\n' },

  { type: 'number', value: '1' },
  { type: 'plus', value: '+' },
  { type: 'number', value: '2' },
  { type: 'asterisk', value: '*' },
  { type: 'number', value: '3' },
  { type: 'asterisk', value: '*' },
  { type: 'number', value: '4' },
  { type: 'newline', value: '\n' },

  { type: 'number', value: '1' },
  { type: 'asterisk', value: '*' },
  { type: 'number', value: '2' },
  { type: 'plus', value: '+' },
  { type: 'number', value: '3' },
  { type: 'plus', value: '+' },
  { type: 'number', value: '4' },
  { type: 'newline', value: '\n' },
];

const ast: AST = [
  {
    type: 'BinaryOpExpr',
    operator: Op.Plus,
    returnType: 'Num',
    expr1: {
      type: 'NumberLiteral',
      value: '1',
      returnType: 'Num',
    },
    expr2: {
      type: 'BinaryOpExpr',
      operator: Op.Asterisk,
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
  {
    type: 'BinaryOpExpr',
    operator: Op.Plus,
    returnType: 'Num',
    expr1: {
      type: 'BinaryOpExpr',
      operator: Op.Asterisk,
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
    },
    expr2: {
      type: 'NumberLiteral',
      value: '3',
      returnType: 'Num',
    },
  },
  {
    type: 'BinaryOpExpr',
    operator: Op.Plus,
    returnType: 'Num',
    expr1: {
      type: 'BinaryOpExpr',
      operator: Op.Plus,
      returnType: 'Num',
      expr1: {
        type: 'NumberLiteral',
        value: '1',
        returnType: 'Num',
      },
      expr2: {
        type: 'BinaryOpExpr',
        operator: Op.Asterisk,
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
      }
    },
    expr2: {
      type: 'NumberLiteral',
      value: '4',
      returnType: 'Num',
    },
  },
  {
    type: 'BinaryOpExpr',
    operator: Op.Plus,
    returnType: 'Num',
    expr1: {
      type: 'BinaryOpExpr',
      operator: Op.Asterisk,
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
    },
    expr2: {
      type: 'BinaryOpExpr',
      operator: Op.Asterisk,
      returnType: 'Num',
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
  {
    type: 'BinaryOpExpr',
    operator: Op.Plus,
    returnType: 'Num',
    expr1: {
      type: 'NumberLiteral',
      value: '1',
      returnType: 'Num',
    },
    expr2: {
      type: 'BinaryOpExpr',
      operator: Op.Asterisk,
      returnType: 'Num',
      expr1: {
        type: 'BinaryOpExpr',
        operator: Op.Asterisk,
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
      expr2: {
        type: 'NumberLiteral',
        value: '4',
        returnType: 'Num',
      },
    }
  },
  {
    type: 'BinaryOpExpr',
    operator: Op.Plus,
    returnType: 'Num',
    expr1: {
      type: 'BinaryOpExpr',
      operator: Op.Plus,
      returnType: 'Num',
      expr1: {
        type: 'BinaryOpExpr',
        operator: Op.Asterisk,
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
      },
      expr2: {
        type: 'NumberLiteral',
        value: '3',
        returnType: 'Num',
      },
    },
    expr2: {
      type: 'NumberLiteral',
      value: '4',
      returnType: 'Num',
    },
  },
];

const compiled = `\
1 + (2 * 3);
1 * 2 + 3;
1 + (2 * 3) + 4;
1 * 2 + (3 * 4);
1 + (2 * 3 * 4);
1 * 2 + 3 + 4;
`;

export {
  program,
  tokens,
  ast,
  compiled,
};
