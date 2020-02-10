import { Token, AST, Operator as Op, ParseOptions } from '../../types';
import { NumberLiteral, prioritize, Arithmetic, Var } from '../helper';
import Scope from '../../parser/Scope';

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
    returnType: 'Bool',
    expr1: Arithmetic(3, '+', 1),
    expr2: NumberLiteral(2)
  },
  {
    type: 'BinaryOpExpr',
    operator: Op.Lt,
    returnType: 'Bool',
    expr1: Arithmetic(5, '*', 3),
    expr2: {
      type: 'BinaryOpExpr',
      operator: Op.Dash,
      returnType: 'Num',
      expr1: NumberLiteral(15),
      expr2: Arithmetic(6, '*', 8),
    },
  },
  {
    type: 'OrExpr',
    returnType: 'Bool',
    expr1: {
      type: 'BinaryOpExpr',
      operator: Op.GtEq,
      returnType: 'Bool',
      expr1: NumberLiteral(11),
      expr2: Arithmetic(7, '+', 7),
    },
    expr2: {
      type: 'BinaryOpExpr',
      operator: Op.LtEq,
      returnType: 'Bool',
      expr1: NumberLiteral(3),
      expr2: {
        type: 'BinaryOpExpr',
        operator: Op.Slash,
        returnType: 'Num',
        expr1: prioritize(Arithmetic(6, '+', 2)),
        expr2: NumberLiteral(3), 
      },
    },
  },
  {
    type: 'OrExpr',
    returnType: 'Bool',
    expr1: {
      type: 'AndExpr',
      returnType: 'Bool',
      expr1: {
        type: 'BinaryOpExpr',
        operator: Op.Gt,
        returnType: 'Bool',
        expr1: {
          type: 'BinaryOpExpr',
          operator: Op.Slash,
          returnType: 'Num',
          expr1: NumberLiteral(8),
          expr2: prioritize(Arithmetic(4, '*', 2)),
        },
        expr2: NumberLiteral(3)
      },
      expr2: {
        type: 'NotExpr',
        returnType: 'Bool',
        expr: {
          type: 'BinaryOpExpr',
          operator: Op.EqEq,
          returnType: 'Bool',
          expr1: {
            type: 'BinaryOpExpr',
            operator: Op.Plus,
            returnType: 'Num',
            expr1: NumberLiteral(1),
            expr2: Arithmetic(2, '*', 3),
          },
          expr2: NumberLiteral(7)
        },
      },
    },
    expr2: {
      type: 'BinaryOpExpr',
      operator: Op.BangEq,
      returnType: 'Bool',
      expr1: {
        type: 'BinaryOpExpr',
        operator: Op.Plus,
        returnType: 'Num',
        expr1: Var('a', 'Num'),
        expr2: {
          type: 'BinaryOpExpr',
          operator: Op.Asterisk,
          returnType: 'Num',
          expr1: Arithmetic('b', '/', 'c'),
          expr2: Var('d', 'Num'),
        },
      },
      expr2: {
        type: 'BinaryOpExpr',
        operator: Op.Dash,
        returnType: 'Num',
        expr1: Var('w', 'Num'),
        expr2: Arithmetic('x', '*', 'y'),
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

const minified = '3+1>2;5*3<15-(6*8);11>=7+7||3<=(6+2)/3;8/(4*2)>3&&!(1+(2*3)===7)||a+(b/c*d)!==w-(x*y);';

const scope = new Scope();
const parseOptions: ParseOptions = { scope };

scope.createConstant('a', 'Num');
scope.createConstant('b', 'Num');
scope.createConstant('c', 'Num');
scope.createConstant('d', 'Num');
scope.createConstant('w', 'Num');
scope.createConstant('x', 'Num');
scope.createConstant('y', 'Num');

export {
  program,
  tokens,
  ast,
  compiled,
  parseOptions,
  minified,
};
