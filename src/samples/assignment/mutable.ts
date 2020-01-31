import { Token, AST } from '../../types';

const program = `\
mutable foo = 123
`;

const tokens: Array<Token> = [
  { type: 'keyword', value: 'mutable' },
  { type: 'ident', value: 'foo' },
  { type: 'eq', value: '=' },
  { type: 'number', value: '123' },
  { type: 'newline', value: '\n' },
];

const ast: AST = [
  {
    type: 'AssignmentExpr',
    returnType: 'Void',
    expr1: { type: 'IdentLiteral', value: 'foo', returnType: 'Num', },
    expr2: { type: 'NumberLiteral', value: '123', returnType: 'Num' },
  },
];

const compiled = `\
let foo = 123;
`;

export {
  program,
  tokens,
  ast,
  compiled,
};
