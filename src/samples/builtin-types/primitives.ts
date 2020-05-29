import { Token, AST } from '../../types';
import { DataType as DT } from '../../parser/utils';

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
  { type: 'NumberLiteral', value: '123', return: DT.Num },
  { type: 'StringLiteral', value: 'Hello world', return: DT.Str },
  { type: 'BooleanLiteral', value: 'True', return: DT.Bool },
  { type: 'NullLiteral', value: 'Null', return: DT.Null },
];

const compiled = `\
123;
'Hello world';
true;
null;
`;

const minified = '123;\'Hello world\';true;null;';

export {
  tokens,
  ast,
  compiled,
  minified,
};
