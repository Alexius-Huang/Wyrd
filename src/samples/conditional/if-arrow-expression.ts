import { Token, AST, Operator as Op, CompilerOptions } from '../../types';
import { NumberLiteral, StringLiteral, Var } from '../helper';
import { DataType as DT, Scope } from '../../parser/utils';

const tokens: Array<Token> = [
  { type: 'keyword', value: 'if' },
  { type: 'ident', value: 'age' },
  { type: 'lt', value: '<' },
  { type: 'number', value: '18' },
  { type: 'arrow', value: '=>' },
  { type: 'string', value: 'youngster' },
  { type: 'newline', value: '\n' },
  { type: 'keyword', value: 'else' },
  { type: 'arrow', value: '=>' },
  { type: 'string', value: 'adult' },
  { type: 'newline', value: '\n' },
  { type: 'newline', value: '\n' },

  { type: 'ident', value: 'example1' },
  { type: 'eq', value: '=' },
  { type: 'keyword', value: 'if' },
  { type: 'ident', value: 'age' },
  { type: 'lt', value: '<' },
  { type: 'number', value: '18' },
  { type: 'arrow', value: '=>' },
  { type: 'string', value: 'youngster' },
  { type: 'newline', value: '\n' },
  { type: 'keyword', value: 'else' },
  { type: 'arrow', value: '=>' },
  { type: 'string', value: 'adult' },
  { type: 'newline', value: '\n' },
  { type: 'newline', value: '\n' },

  { type: 'ident', value: 'example2' },
  { type: 'eq', value: '=' },
  { type: 'keyword', value: 'if' },
  { type: 'ident', value: 'age' },
  { type: 'lt', value: '<' },
  { type: 'number', value: '18' },
  { type: 'arrow', value: '=>' },
  { type: 'string', value: 'youngster' },
  { type: 'newline', value: '\n' },
  { type: 'keyword', value: 'elif' },
  { type: 'ident', value: 'age' },
  { type: 'lteq', value: '<=' },
  { type: 'number', value: '60' },
  { type: 'arrow', value: '=>' },
  { type: 'string', value: 'adult' },
  { type: 'newline', value: '\n' },
  { type: 'keyword', value: 'elif' },
  { type: 'ident', value: 'age' },
  { type: 'lt', value: '<' },
  { type: 'number', value: '100' },
  { type: 'arrow', value: '=>' },
  { type: 'string', value: 'elder' },
  { type: 'newline', value: '\n' },
  { type: 'keyword', value: 'else' },
  { type: 'arrow', value: '=>' },
  { type: 'string', value: 'centenarian' },
  { type: 'newline', value: '\n' },
];

const ast: AST = [
  {
    type: 'ConditionalExpr',
    return: DT.Str,
    condition: {
      type: 'BinaryOpExpr',
      operator: Op.Lt,
      return: DT.Bool,
      expr1: Var('age', DT.Num),
      expr2: NumberLiteral(18),
    },
    expr1: StringLiteral('youngster'),
    expr2: StringLiteral('adult'),
  },
  {
    type: 'AssignmentExpr',
    return: DT.Void,
    expr1: Var('example1', DT.Str),
    expr2: {
      type: 'ConditionalExpr',
      return: DT.Str,
      condition: {
        type: 'BinaryOpExpr',
        operator: Op.Lt,
        return: DT.Bool,
        expr1: Var('age', DT.Num),
        expr2: NumberLiteral(18),
      },
      expr1: StringLiteral('youngster'),
      expr2: StringLiteral('adult'),
    },
  },
  {
    type: 'AssignmentExpr',
    return: DT.Void,
    expr1: Var('example2', DT.Str),
    expr2: {
      type: 'ConditionalExpr',
      return: DT.Str,
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
        return: DT.Str,
        condition: {
          type: 'BinaryOpExpr',
          operator: Op.LtEq,
          return: DT.Bool,
          expr1: Var('age', DT.Num),
          expr2: NumberLiteral(60),
        },
        expr1: StringLiteral('adult'),
        expr2: {
          type: 'ConditionalExpr',
          return: DT.Str,
          condition: {
            type: 'BinaryOpExpr',
            operator: Op.Lt,
            return: DT.Bool,
            expr1: Var('age', DT.Num),
            expr2: NumberLiteral(100),
          },
          expr1: StringLiteral('elder'),
          expr2: StringLiteral('centenarian'),
        },
      },
    },
  },
];

const compiled = `\
age < 18 ? 'youngster' : 'adult';
const example1 = age < 18 ? 'youngster' : 'adult';
const example2 = age < 18 ? 'youngster' : (age <= 60 ? 'adult' : (age < 100 ? 'elder' : 'centenarian'));
`;

const minified = 'age<18?\'youngster\':\'adult\';const example1=age<18?\'youngster\':\'adult\';const example2=age<18?\'youngster\':(age<=60?\'adult\':(age<100?\'elder\':\'centenarian\'));';

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
