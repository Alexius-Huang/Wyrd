import { Token, AST, Operator as Op, ParseOptions, Variable } from '../../types';
import { NumberLiteral, StringLiteral, Var } from '../helper';

const program = `\
example = if age < 18 then
            "youngster"
          elif age <= 60 then
            "adult"
          elif age < 100 then
            "elder"
          else then
            "centenarian"
          end
`;

const tokens: Array<Token> = [
  { type: 'ident', value: 'example' },
  { type: 'eq', value: '=' },
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
  { type: 'lteq', value: '<=' },
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
  { type: 'keyword', value: 'else' },
  { type: 'keyword', value: 'then' },
  { type: 'newline', value: '\n' },
  { type: 'string', value: 'centenarian' },
  { type: 'newline', value: '\n' },
  { type: 'keyword', value: 'end'  },
  { type: 'newline', value: '\n' },
];

const ast: AST = [
  {
    type: 'AssignmentExpr',
    returnType: 'Void',
    expr1: Var('example', 'Str'),
    expr2: {
      type: 'ConditionalExpr',
      returnType: 'Str',
      condition: {
        type: 'BinaryOpExpr',
        operator: Op.Lt,
        returnType: 'Bool',
        expr1: Var('age', 'Num'),
        expr2: NumberLiteral(18),
      },
      expr1: StringLiteral('youngster'),
      expr2: {
        type: 'ConditionalExpr',
        returnType: 'Str',
        condition: {
          type: 'BinaryOpExpr',
          operator: Op.LtEq,
          returnType: 'Bool',
          expr1: Var('age', 'Num'),
          expr2: NumberLiteral(60),
        },
        expr1: StringLiteral('adult'),
        expr2: {
          type: 'ConditionalExpr',
          returnType: 'Str',
          condition: {
            type: 'BinaryOpExpr',
            operator: Op.Lt,
            returnType: 'Bool',
            expr1: Var('age', 'Num'),
            expr2: NumberLiteral(100)
          },
          expr1: StringLiteral('elder'),
          expr2: StringLiteral('centenarian'),
        },
      },
    },
  },
];

const compiled = `\
const example = age < 18 ? 'youngster' : (age <= 60 ? 'adult' : (age < 100 ? 'elder' : 'centenarian'));
`;

const minified = 'const example=age<18?\'youngster\':(age<=60?\'adult\':(age<100?\'elder\':\'centenarian\'));';

const parseOptions: ParseOptions = {
  variables: new Map<string, Variable>([
    ['age', { name: 'age', isConst: true, type: 'Num' }],
  ]),
};

export {
  program,
  tokens,
  ast,
  compiled,
  parseOptions,
  minified,
};
