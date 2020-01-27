import { Token, AST } from '../../types';

const program = `\
foo = 123
bar = "Hello world"
baz = True
nothing = Null
`;

const tokens: Array<Token> = [
  { type: 'ident', value: 'foo' },
  { type: 'eq', value: '=' },
  { type: 'number', value: '123' },
  { type: 'newline', value: '\n' },
  { type: 'ident', value: 'bar' },
  { type: 'eq', value: '=' },
  { type: 'string', value: 'Hello world' },
  { type: 'newline', value: '\n' },
  { type: 'ident', value: 'baz' },
  { type: 'eq', value: '=' },
  { type: 'boolean', value: 'True' },
  { type: 'newline', value: '\n' },
  { type: 'ident', value: 'nothing' },
  { type: 'eq', value: '=' },
  { type: 'null', value: 'Null' },
  { type: 'newline', value: '\n' },
];

const ast: AST = [
  {
    type: 'AssignmentExpr',
    expr1: { type: 'IdentLiteral', value: 'foo', returnType: 'Num', },
    expr2: { type: 'NumberLiteral', value: '123', returnType: 'Num' }
  },
  {
    type: 'AssignmentExpr',
    expr1: { type: 'IdentLiteral', value: 'bar', returnType: 'Str', },
    expr2: { type: 'StringLiteral', value: 'Hello world', returnType: 'Str' }
  },
  {
    type: 'AssignmentExpr',
    expr1: { type: 'IdentLiteral', value: 'baz', returnType: 'Bool' },
    expr2: { type: 'BooleanLiteral', value: 'True', returnType: 'Bool' }
  },
  {
    type: 'AssignmentExpr',
    expr1: { type: 'IdentLiteral', value: 'nothing', returnType: 'Null' },
    expr2: { type: 'NullLiteral', value: 'Null', returnType: 'Null' }
  },
];

const compiled = `\
const foo = 123;
const bar = 'Hello world';
const baz = true;
const nothing = null;
`;

export {
  program,
  tokens,
  ast,
  compiled,
};
