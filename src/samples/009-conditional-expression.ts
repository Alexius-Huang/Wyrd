import { Token, AST, Operator as Op } from '../types';

const program = `\
if age < 18 => "youngster"
else        => "adult"

example1 = if age < 18 => "youngster"
           else        => "adult"

example2 = if age < 18    => "youngster"
           elif age <= 60 => "adult"
           elif age < 100 => "elder"
           else           => "centenarian"

example3 = if age < 18 then
             "youngster"
           elif age <= 60 then
             "adult"
           elif age < 100 then
             "elder"
           else then
             "centenarian"
           end

mixed1 = if age < 18 then
           "youngster"
         elif age <= 60 => "adult"
         elif age < 100 then
           "elder"
         else => "centenarian"

mixed2 = if age < 18 => "youngster"
         elif age <= 60 then
           "adult"
         elif age < 100 => "elder"
         else then
           "centenarian"
         end
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
  { type: 'newline', value: '\n' },

  { type: 'ident', value: 'example3' },
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
  { type: 'newline', value: '\n' },

  { type: 'ident', value: 'mixed1' },
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
  { type: 'arrow', value: '=>' },
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
  { type: 'arrow', value: '=>' },
  { type: 'string', value: 'centenarian' },
  { type: 'newline', value: '\n' },
  { type: 'newline', value: '\n' },

  { type: 'ident', value: 'mixed2' },
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
  { type: 'keyword', value: 'then' },
  { type: 'newline', value: '\n' },
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
  { type: 'keyword', value: 'then' },
  { type: 'newline', value: '\n' },
  { type: 'string', value: 'centenarian' },
  { type: 'newline', value: '\n' },
  { type: 'keyword', value: 'end' },
  { type: 'newline', value: '\n' },
];

const ast: AST = [
  {
    type: 'ConditionalExpr',
    condition: {
      type: 'BinaryOpExpr',
      operator: Op.Lt,
      expr1: { type: 'IdentLiteral', value: 'age' },
      expr2: { type: 'NumberLiteral', value: '18' }
    },
    expr1: { type: 'StringLiteral', value: 'youngster' },
    expr2: { type: 'StringLiteral', value: 'adult' },
  },
  {
    type: 'AssignmentExpr',
    expr1: { type: 'IdentLiteral', value: 'example1' },
    expr2: {
      type: 'ConditionalExpr',
      condition: {
        type: 'BinaryOpExpr',
        operator: Op.Lt,
        expr1: { type: 'IdentLiteral', value: 'age' },
        expr2: { type: 'NumberLiteral', value: '18' }
      },
      expr1: { type: 'StringLiteral', value: 'youngster' },
      expr2: { type: 'StringLiteral', value: 'adult' },
    },
  },
  {
    type: 'AssignmentExpr',
    expr1: { type: 'IdentLiteral', value: 'example2' },
    expr2: {
      type: 'ConditionalExpr',
      condition: {
        type: 'BinaryOpExpr',
        operator: Op.Lt,
        expr1: { type: 'IdentLiteral', value: 'age' },
        expr2: { type: 'NumberLiteral', value: '18' }
      },
      expr1: { type: 'StringLiteral', value: 'youngster' },
      expr2: {
        type: 'ConditionalExpr',
        condition: {
          type: 'BinaryOpExpr',
          operator: Op.LtEq,
          expr1: { type: 'IdentLiteral', value: 'age' },
          expr2: { type: 'NumberLiteral', value: '60' }
        },
        expr1: { type: 'StringLiteral', value: 'adult' },
        expr2: {
          type: 'ConditionalExpr',
          condition: {
            type: 'BinaryOpExpr',
            operator: Op.Lt,
            expr1: { type: 'IdentLiteral', value: 'age' },
            expr2: { type: 'NumberLiteral', value: '100' }
          },
          expr1: { type: 'StringLiteral', value: 'elder' },
          expr2: { type: 'StringLiteral', value: 'centenarian' },
        },
      },
    },
  },
  {
    type: 'AssignmentExpr',
    expr1: { type: 'IdentLiteral', value: 'example3' },
    expr2: {
      type: 'ConditionalExpr',
      condition: {
        type: 'BinaryOpExpr',
        operator: Op.Lt,
        expr1: { type: 'IdentLiteral', value: 'age' },
        expr2: { type: 'NumberLiteral', value: '18' }
      },
      expr1: { type: 'StringLiteral', value: 'youngster' },
      expr2: {
        type: 'ConditionalExpr',
        condition: {
          type: 'BinaryOpExpr',
          operator: Op.LtEq,
          expr1: { type: 'IdentLiteral', value: 'age' },
          expr2: { type: 'NumberLiteral', value: '60' }
        },
        expr1: { type: 'StringLiteral', value: 'adult' },
        expr2: {
          type: 'ConditionalExpr',
          condition: {
            type: 'BinaryOpExpr',
            operator: Op.Lt,
            expr1: { type: 'IdentLiteral', value: 'age' },
            expr2: { type: 'NumberLiteral', value: '100' }
          },
          expr1: { type: 'StringLiteral', value: 'elder' },
          expr2: { type: 'StringLiteral', value: 'centenarian' },
        },
      },
    },
  },
  {
    type: 'AssignmentExpr',
    expr1: { type: 'IdentLiteral', value: 'mixed1' },
    expr2: {
      type: 'ConditionalExpr',
      condition: {
        type: 'BinaryOpExpr',
        operator: Op.Lt,
        expr1: { type: 'IdentLiteral', value: 'age' },
        expr2: { type: 'NumberLiteral', value: '18' }
      },
      expr1: { type: 'StringLiteral', value: 'youngster' },
      expr2: {
        type: 'ConditionalExpr',
        condition: {
          type: 'BinaryOpExpr',
          operator: Op.LtEq,
          expr1: { type: 'IdentLiteral', value: 'age' },
          expr2: { type: 'NumberLiteral', value: '60' }
        },
        expr1: { type: 'StringLiteral', value: 'adult' },
        expr2: {
          type: 'ConditionalExpr',
          condition: {
            type: 'BinaryOpExpr',
            operator: Op.Lt,
            expr1: { type: 'IdentLiteral', value: 'age' },
            expr2: { type: 'NumberLiteral', value: '100' }
          },
          expr1: { type: 'StringLiteral', value: 'elder' },
          expr2: { type: 'StringLiteral', value: 'centenarian' },
        },
      },
    },
  },
  {
    type: 'AssignmentExpr',
    expr1: { type: 'IdentLiteral', value: 'mixed2' },
    expr2: {
      type: 'ConditionalExpr',
      condition: {
        type: 'BinaryOpExpr',
        operator: Op.Lt,
        expr1: { type: 'IdentLiteral', value: 'age' },
        expr2: { type: 'NumberLiteral', value: '18' }
      },
      expr1: { type: 'StringLiteral', value: 'youngster' },
      expr2: {
        type: 'ConditionalExpr',
        condition: {
          type: 'BinaryOpExpr',
          operator: Op.LtEq,
          expr1: { type: 'IdentLiteral', value: 'age' },
          expr2: { type: 'NumberLiteral', value: '60' }
        },
        expr1: { type: 'StringLiteral', value: 'adult' },
        expr2: {
          type: 'ConditionalExpr',
          condition: {
            type: 'BinaryOpExpr',
            operator: Op.Lt,
            expr1: { type: 'IdentLiteral', value: 'age' },
            expr2: { type: 'NumberLiteral', value: '100' }
          },
          expr1: { type: 'StringLiteral', value: 'elder' },
          expr2: { type: 'StringLiteral', value: 'centenarian' },
        },
      },
    },
  },
];

const compiled = `\
age < 18 ? 'youngster' : 'adult';
const example1 = age < 18 ? 'youngster' : 'adult';
const example2 = age < 18 ? 'youngster' : (age <= 60 ? 'adult' : (age < 100 ? 'elder' : 'centenarian'));
const example3 = age < 18 ? 'youngster' : (age <= 60 ? 'adult' : (age < 100 ? 'elder' : 'centenarian'));
const mixed1 = age < 18 ? 'youngster' : (age <= 60 ? 'adult' : (age < 100 ? 'elder' : 'centenarian'));
const mixed2 = age < 18 ? 'youngster' : (age <= 60 ? 'adult' : (age < 100 ? 'elder' : 'centenarian'));
`;

export {
  program,
  tokens,
  ast,
  compiled,
};