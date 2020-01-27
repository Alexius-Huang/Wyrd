import { Token, AST, Operator as Op, ParseOptions, Variable } from '../../types';

const program = `\
if age < 18 => "youngster"
else        => "adult"

example1 = if age < 18 => "youngster"
           else        => "adult"

example2 = if age < 18    => "youngster"
           elif age <= 60 => "adult"
           elif age < 100 => "elder"
           else           => "centenarian"
`;

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
    returnType: 'Str',
    condition: {
      type: 'BinaryOpExpr',
      operator: Op.Lt,
      returnType: 'Bool',
      expr1: { type: 'IdentLiteral', value: 'age', returnType: 'Num' },
      expr2: { type: 'NumberLiteral', value: '18', returnType: 'Num' }
    },
    expr1: { type: 'StringLiteral', value: 'youngster', returnType: 'Str' },
    expr2: { type: 'StringLiteral', value: 'adult', returnType: 'Str' },
  },
  {
    type: 'AssignmentExpr',
    expr1: { type: 'IdentLiteral', value: 'example1', returnType: 'Str' },
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
      expr2: { type: 'StringLiteral', value: 'adult', returnType: 'Str' },
    },
  },
  {
    type: 'AssignmentExpr',
    expr1: { type: 'IdentLiteral', value: 'example2', returnType: 'Str' },
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
age < 18 ? 'youngster' : 'adult';
const example1 = age < 18 ? 'youngster' : 'adult';
const example2 = age < 18 ? 'youngster' : (age <= 60 ? 'adult' : (age < 100 ? 'elder' : 'centenarian'));
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
