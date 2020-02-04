import { Token, AST } from '../../types';

const program = `\
123
"Hello world"
True
Null
`;

const tokens: Array<Token> = [
  { type: 'number', value: '123' },
  { type: 'newline', value: '\n' },
  { type: 'string', value: 'Hello world' },
  { type: 'newline', value: '\n' },
  { type: 'boolean', value: 'True' },
  { type: 'newline', value: '\n' },
  { type: 'null', value: 'Null' },
  { type: 'newline', value: '\n' },
];

const ast: AST = [
  { type: 'NumberLiteral', value: '123', returnType: 'Num' },
  { type: 'StringLiteral', value: 'Hello world', returnType: 'Str' },
  { type: 'BooleanLiteral', value: 'True', returnType: 'Bool', },
  { type: 'NullLiteral', value: 'Null', returnType: 'Null' },
];

const compiled = `\
123;
'Hello world';
true;
null;
`;

const minified = '123;\'Hello world\';true;null;';

export {
  program,
  tokens,
  ast,
  compiled,
  minified,
};
