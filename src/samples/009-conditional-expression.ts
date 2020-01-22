import { Token, AST, Operator as Op } from '../types';

const program = `\
if age < 18 => "youngster"
else        => "adult"

example1 = if age < 18 => "youngster"
           else        => "adult"
`;

// TODO: Other Cases
`\
example2 = if age < 18 then
             "youngster"
           else then
             "adult"
           end

example3 = if age < 18    => "youngster"
           elif age <= 60 => "adult"
           else           => "elder"

example4 = if age < 18 then
             "youngster"
           elif age <= 60 then
             "adult"
           else then
             "elder"
           end

mixed = if age < 18 then
          "youngster"
        elif age <= 60 => "adult"
        else then
          "elder"
        end

more = if age < 12 then
         "kids"
       elif age <= 18 then
         "youngster"
       elif age <= 60 then
         "adult"
       else then
         "elder"
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
];

const compiled = `\
age < 18 ? 'youngster' : 'adult';
const example1 = age < 18 ? 'youngster' : 'adult';
`;

// TODO: Other cases
`\
const example2 = age < 18 ? 'youngster' : 'adult';
const example3 = age < 18 ? 'youngster' : (age <= 60 ? 'adult' : 'elder');
const example4 = age < 18 ? 'youngster' : (age <= 60 ? 'adult' : 'elder');
const mixed = age < 18 ? 'youngster' : (age <= 60 ? 'adult' : 'elder');
const more = age < 12 ? 'kids' : (age < 18 ? 'youngster' : (age <= 60 ? 'adult' : 'elder'));
`

export {
  program,
  tokens,
  ast,
  compiled,
};
