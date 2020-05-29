import { Token, AST, Operator as Op, CompilerOptions } from '../../types';
import { NumberLiteral, StringLiteral, Var } from '../helper';
import { DataType as DT, Scope } from '../../parser/utils';
import { VoidExpression } from '../../parser/constants';

const tokens: Array<Token> = [
  { type: 'keyword', value: 'if' },
  { type: 'ident', value: 'age' },
  { type: 'lt', value: '<' },
  { type: 'number', value: '18' },
  { type: 'keyword', value: 'then' },
  { type: 'newline', value: '\n' },
  { type: 'string', value: 'youngster' },
  { type: 'newline', value: '\n' },
  { type: 'keyword', value: 'end'},
  { type: 'newline', value: '\n' },
  { type: 'newline', value: '\n' },

  { type: 'keyword', value: 'if' },
  { type: 'ident', value: 'age' },
  { type: 'lt', value: '<' },
  { type: 'number', value: '18' },
  { type: 'keyword', value: 'then' },
  { type: 'newline', value: '\n' },
  { type: 'string', value: 'youngster' },
  { type: 'newline', value: '\n' },
  { type: 'keyword', value: 'elif' },
  { type: 'ident', value: 'age' },
  { type: 'lt', value: '<' },
  { type: 'number', value: '60' },
  { type: 'keyword', value: 'then' },
  { type: 'newline', value: '\n' },
  { type: 'string', value: 'adult' },
  { type: 'newline', value: '\n' },
  { type: 'keyword', value: 'elif' },
  { type: 'ident', value: 'age' },
  { type: 'lt', value: '<' },
  { type: 'number', value: '100' },
  { type: 'keyword', value: 'then' },
  { type: 'newline', value: '\n' },
  { type: 'string', value: 'elder' },
  { type: 'newline', value: '\n' },
  { type: 'keyword', value: 'end'},
  { type: 'newline', value: '\n' }
];

const ast: AST = [
  {
    type: 'ConditionalExpr',
    return: DT.Maybe.Str,
    condition: {
      type: 'BinaryOpExpr',
      operator: Op.Lt,
      return: DT.Bool,
      expr1: Var('age', DT.Num),
      expr2: NumberLiteral(18),
    },
    expr1: StringLiteral('youngster'),
    expr2: VoidExpression,
  },
  {
    type: 'ConditionalExpr',
    return: DT.Maybe.Str,
    condition: {
      type: 'BinaryOpExpr',
      operator: Op.Lt,
      return: DT.Bool,
      expr1: Var('age', DT.Num),
      expr2: NumberLiteral(18),
    },
    expr1: StringLiteral('youngster'),
    expr2: {
      type: 'ConditionalExpr',
      return: DT.Maybe.Str,
      condition: {
        type: 'BinaryOpExpr',
        operator: Op.Lt,
        return: DT.Bool,
        expr1: Var('age', DT.Num),
        expr2: NumberLiteral(60),
      },
      expr1: StringLiteral('adult'),
      expr2: {
        type: 'ConditionalExpr',
        return: DT.Maybe.Str,
        condition: {
          type: 'BinaryOpExpr',
          operator: Op.Lt,
          return: DT.Bool,
          expr1: Var('age', DT.Num),
          expr2: NumberLiteral(100),
        },
        expr1: StringLiteral('elder'),
        expr2: VoidExpression,
      },
    },
  },
];

const compiled = `\
age < 18 ? 'youngster' : null;
age < 18 ? 'youngster' : (age < 60 ? 'adult' : (age < 100 ? 'elder' : null));
`;

const minified = "age<18?'youngster':null;age<18?'youngster':(age<60?'adult':(age<100?'elder':null));";

const scope = (s: Scope): Scope => {
  s.createConstant('age', DT.Num);
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
