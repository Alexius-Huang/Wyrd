import { Token, AST } from '../../types';

const program = `\
foo = 123
bar = "Hello world"
baz = True
nothing = Null
list = [1 2 3 4 5]
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

  { type: 'ident', value: 'list' },
  { type: 'eq', value: '=' },
  { type: 'lbracket', value: '[' },
  { type: 'number', value: '1' },
  { type: 'number', value: '2' },
  { type: 'number', value: '3' },
  { type: 'number', value: '4' },
  { type: 'number', value: '5' },
  { type: 'rbracket', value: ']' },
  { type: 'newline', value: '\n' },
];

const ast: AST = [
  {
    type: 'AssignmentExpr',
    returnType: 'Void',
    expr1: { type: 'IdentLiteral', value: 'foo', returnType: 'Num' },
    expr2: { type: 'NumberLiteral', value: '123', returnType: 'Num' }
  },
  {
    type: 'AssignmentExpr',
    returnType: 'Void',
    expr1: { type: 'IdentLiteral', value: 'bar', returnType: 'Str' },
    expr2: { type: 'StringLiteral', value: 'Hello world', returnType: 'Str' }
  },
  {
    type: 'AssignmentExpr',
    returnType: 'Void',
    expr1: { type: 'IdentLiteral', value: 'baz', returnType: 'Bool' },
    expr2: { type: 'BooleanLiteral', value: 'True', returnType: 'Bool' }
  },
  {
    type: 'AssignmentExpr',
    returnType: 'Void',
    expr1: { type: 'IdentLiteral', value: 'nothing', returnType: 'Null' },
    expr2: { type: 'NullLiteral', value: 'Null', returnType: 'Null' }
  },
  {
    type: 'AssignmentExpr',
    returnType: 'Void',
    expr1: { type: 'IdentLiteral', value: 'list', returnType: 'List[Num]' },
    expr2: {
      type: 'ListLiteral',
      values: [
        { type: 'NumberLiteral', value: '1', returnType: 'Num' },
        { type: 'NumberLiteral', value: '2', returnType: 'Num' },
        { type: 'NumberLiteral', value: '3', returnType: 'Num' },
        { type: 'NumberLiteral', value: '4', returnType: 'Num' },
        { type: 'NumberLiteral', value: '5', returnType: 'Num' },
      ],
      elementType: 'Num',
      returnType: 'List[Num]',
    },
  },
];

const compiled = `\
const foo = 123;
const bar = 'Hello world';
const baz = true;
const nothing = null;
const list = [1, 2, 3, 4, 5];
`;

export {
  program,
  tokens,
  ast,
  compiled,
};
