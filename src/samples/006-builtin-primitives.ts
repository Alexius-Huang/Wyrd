import { Token, AST, Operator as Op } from '../types';

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
    expr1: { type: 'IdentLiteral', value: 'foo' },
    expr2: { type: 'NumberLiteral', value: '123' }
  },
  {
    type: 'AssignmentExpr',
    expr1: { type: 'IdentLiteral', value: 'bar' },
    expr2: { type: 'StringLiteral', value: 'Hello world' }
  },
  {
    type: 'AssignmentExpr',
    expr1: { type: 'IdentLiteral', value: 'baz' },
    expr2: { type: 'BooleanLiteral', value: 'True' }
  },
  {
    type: 'AssignmentExpr',
    expr1: { type: 'IdentLiteral', value: 'nothing' },
    expr2: { type: 'NullLiteral', value: 'Null' }
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
