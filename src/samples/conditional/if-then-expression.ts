import { Token, AST, Operator as Op, ParseOptions, Variable } from '../../types';

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
    expr1: { type: 'IdentLiteral', value: 'example', returnType: 'Str' },
    expr2: {
      type: 'ConditionalExpr',
      returnType: 'Str',
      condition: {
        type: 'BinaryOpExpr',
        operator: Op.Lt,
        returnType: 'Bool',
        expr1: { type: 'IdentLiteral', value: 'age', returnType: 'Num' },
        expr2: { type: 'NumberLiteral', value: '18', returnType: 'Num' }
      },
      expr1: { type: 'StringLiteral', value: 'youngster', returnType: 'Str' },
      expr2: {
        type: 'ConditionalExpr',
        returnType: 'Str',
        condition: {
          type: 'BinaryOpExpr',
          operator: Op.LtEq,
          returnType: 'Bool',
          expr1: { type: 'IdentLiteral', value: 'age', returnType: 'Num' },
          expr2: { type: 'NumberLiteral', value: '60', returnType: 'Num' }
        },
        expr1: { type: 'StringLiteral', value: 'adult', returnType: 'Str' },
        expr2: {
          type: 'ConditionalExpr',
          returnType: 'Str',
          condition: {
            type: 'BinaryOpExpr',
            operator: Op.Lt,
            returnType: 'Bool',
            expr1: { type: 'IdentLiteral', value: 'age', returnType: 'Num' },
            expr2: { type: 'NumberLiteral', value: '100', returnType: 'Num' }
          },
          expr1: { type: 'StringLiteral', value: 'elder', returnType: 'Str' },
          expr2: { type: 'StringLiteral', value: 'centenarian', returnType: 'Str' },
        },
      },
    },
  },
];

const compiled = `\
const example = age < 18 ? 'youngster' : (age <= 60 ? 'adult' : (age < 100 ? 'elder' : 'centenarian'));
`;

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
};
