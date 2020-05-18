import { Token, AST, Operator as Op, ParseOptions } from '../../types';
import { NumberLiteral, StringLiteral, Var } from '../helper';
import { DataType as DT, Scope } from '../../parser/utils';
import { EmptyExpression } from '../../parser/constants';

const program = `\
if age < 18 => "youngster"

if age < 18 => "youngster"
elif age < 60 => "adult"
elif age < 100 => "elder"
`;

const tokens: Array<Token> = [
  { type: 'keyword', value: 'if' },
  { type: 'ident', value: 'age' },
  { type: 'lt', value: '<' },
  { type: 'number', value: '18' },
  { type: 'arrow', value: '=>' },
  { type: 'string', value: 'youngster' },
  { type: 'newline', value: '\n' },
  { type: 'newline', value: '\n' },

  { type: 'keyword', value: 'if' },
  { type: 'ident', value: 'age' },
  { type: 'lt', value: '<' },
  { type: 'number', value: '18' },
  { type: 'arrow', value: '=>' },
  { type: 'string', value: 'youngster' },
  { type: 'newline', value: '\n' },
  { type: 'keyword', value: 'elif' },
  { type: 'ident', value: 'age' },
  { type: 'lt', value: '<' },
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
    expr2: EmptyExpression,
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
        expr2: EmptyExpression,
      },
    },
  },
];

const compiled = `\
age < 18 ? 'youngster' : null;
age < 18 ? 'youngster' : (age < 60 ? 'adult' : (age < 100 ? 'elder' : null));
`;

const minified = "age<18?'youngster':null;age<18?'youngster':(age<60?'adult':(age<100?'elder':null));";

const scope = () => {
  const result = new Scope();
  result.createConstant('age', DT.Num);

  return result;
};

const parseOptions: ParseOptions = { scope };

export {
  program,
  tokens,
  ast,
  compiled,
  parseOptions,
  minified,
};
