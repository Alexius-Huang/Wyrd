import { Token, AST, Operator as Op, CompilerOptions } from '../../types';
import { DataType as DT, Scope } from '../../parser/utils';
import { NumberLiteral, prioritize, Arithmetic, Var } from '../helper';

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
  { type: 'newline', value: '\n' },
];

const ast: AST = [
  {
    type: 'BinaryOpExpr',
    operator: Op.Gt,
    return: DT.Bool,
    expr1: Arithmetic(3, '+', 1),
    expr2: NumberLiteral(2)
  },
  {
    type: 'BinaryOpExpr',
    operator: Op.Lt,
    return: DT.Bool,
    expr1: Arithmetic(5, '*', 3),
    expr2: {
      type: 'BinaryOpExpr',
      operator: Op.Dash,
      return: DT.Num,
      expr1: NumberLiteral(15),
      expr2: Arithmetic(6, '*', 8),
    },
  },
  {
    type: 'OrExpr',
    return: DT.Bool,
    expr1: {
      type: 'BinaryOpExpr',
      operator: Op.GtEq,
      return: DT.Bool,
      expr1: NumberLiteral(11),
      expr2: Arithmetic(7, '+', 7),
    },
    expr2: {
      type: 'BinaryOpExpr',
      operator: Op.LtEq,
      return: DT.Bool,
      expr1: NumberLiteral(3),
      expr2: {
        type: 'BinaryOpExpr',
        operator: Op.Slash,
        return: DT.Num,
        expr1: prioritize(Arithmetic(6, '+', 2)),
        expr2: NumberLiteral(3), 
      },
    },
  },
  {
    type: 'OrExpr',
    return: DT.Bool,
    expr1: {
      type: 'AndExpr',
      return: DT.Bool,
      expr1: {
        type: 'BinaryOpExpr',
        operator: Op.Gt,
        return: DT.Bool,
        expr1: {
          type: 'BinaryOpExpr',
          operator: Op.Slash,
          return: DT.Num,
          expr1: NumberLiteral(8),
          expr2: prioritize(Arithmetic(4, '*', 2)),
        },
        expr2: NumberLiteral(3)
      },
      expr2: {
        type: 'NotExpr',
        return: DT.Bool,
        expr: {
          type: 'BinaryOpExpr',
          operator: Op.EqEq,
          return: DT.Bool,
          expr1: {
            type: 'BinaryOpExpr',
            operator: Op.Plus,
            return: DT.Num,
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
      return: DT.Bool,
      expr1: {
        type: 'BinaryOpExpr',
        operator: Op.Plus,
        return: DT.Num,
        expr1: Var('a', DT.Num),
        expr2: {
          type: 'BinaryOpExpr',
          operator: Op.Asterisk,
          return: DT.Num,
          expr1: Arithmetic('b', '/', 'c'),
          expr2: Var('d', DT.Num),
        },
      },
      expr2: {
        type: 'BinaryOpExpr',
        operator: Op.Dash,
        return: DT.Num,
        expr1: Var('w', DT.Num),
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

const scope = (s: Scope): Scope => {
  s.createConstant('a', DT.Num);
  s.createConstant('b', DT.Num);
  s.createConstant('c', DT.Num);
  s.createConstant('d', DT.Num);
  s.createConstant('w', DT.Num);
  s.createConstant('x', DT.Num);
  s.createConstant('y', DT.Num);
  return s;
};

const compilerOptions: CompilerOptions = { scopeMiddleware: scope };

export {
  tokens,
  ast,
  compiled,
  compilerOptions,
  minified,
};
