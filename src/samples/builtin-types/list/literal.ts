import { Token, AST } from '../../../types';

const program = `\
[1 2 3 4 5]
["Hello world" "Wyrd" "Lang" "is" "Awesome"]
[True False False True True False True]
[Null Null Null Null Null]
`;

const tokens: Array<Token> = [
  { type: 'lbracket', value: '[' },
  { type: 'number', value: '1' },
  { type: 'number', value: '2' },
  { type: 'number', value: '3' },
  { type: 'number', value: '4' },
  { type: 'number', value: '5' },
  { type: 'rbracket', value: ']' },
  { type: 'newline', value: '\n' },

  { type: 'lbracket', value: '[' },
  { type: 'string', value: 'Hello world' },
  { type: 'string', value: 'Wyrd' },
  { type: 'string', value: 'Lang' },
  { type: 'string', value: 'is' },
  { type: 'string', value: 'Awesome' },
  { type: 'rbracket', value: ']' },
  { type: 'newline', value: '\n' },

  { type: 'lbracket', value: '[' },
  { type: 'boolean', value: 'True' },
  { type: 'boolean', value: 'False' },
  { type: 'boolean', value: 'False' },
  { type: 'boolean', value: 'True' },
  { type: 'boolean', value: 'True' },
  { type: 'boolean', value: 'False' },
  { type: 'boolean', value: 'True' },
  { type: 'rbracket', value: ']' },
  { type: 'newline', value: '\n' },

  { type: 'lbracket', value: '[' },
  { type: 'null', value: 'Null' },
  { type: 'null', value: 'Null' },
  { type: 'null', value: 'Null' },
  { type: 'null', value: 'Null' },
  { type: 'null', value: 'Null' },
  { type: 'rbracket', value: ']' },
  { type: 'newline', value: '\n' },
];

const ast: AST = [
  {
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
  {
    type: 'ListLiteral',
    values: [
      { type: 'StringLiteral', value: 'Hello world', returnType: 'Str' },
      { type: 'StringLiteral', value: 'Wyrd', returnType: 'Str' },
      { type: 'StringLiteral', value: 'Lang', returnType: 'Str' },
      { type: 'StringLiteral', value: 'is', returnType: 'Str' },
      { type: 'StringLiteral', value: 'Awesome', returnType: 'Str' },
    ],
    elementType: 'Str',
    returnType: 'List[Str]',
  },
  {
    type: 'ListLiteral',
    values: [
      { type: 'BooleanLiteral', value: 'True', returnType: 'Bool' },
      { type: 'BooleanLiteral', value: 'False', returnType: 'Bool' },
      { type: 'BooleanLiteral', value: 'False', returnType: 'Bool' },
      { type: 'BooleanLiteral', value: 'True', returnType: 'Bool' },
      { type: 'BooleanLiteral', value: 'True', returnType: 'Bool' },
      { type: 'BooleanLiteral', value: 'False', returnType: 'Bool' },
      { type: 'BooleanLiteral', value: 'True', returnType: 'Bool' },
    ],
    elementType: 'Bool',
    returnType: 'List[Bool]',
  },
  {
    type: 'ListLiteral',
    values: [
      { type: 'NullLiteral', value: 'Null', returnType: 'Null' },
      { type: 'NullLiteral', value: 'Null', returnType: 'Null' },
      { type: 'NullLiteral', value: 'Null', returnType: 'Null' },
      { type: 'NullLiteral', value: 'Null', returnType: 'Null' },
      { type: 'NullLiteral', value: 'Null', returnType: 'Null' },
    ],
    elementType: 'Null',
    returnType: 'List[Null]',
  },
];

const compiled = `\
[1, 2, 3, 4, 5];
['Hello world', 'Wyrd', 'Lang', 'is', 'Awesome'];
[true, false, false, true, true, false, true];
[null, null, null, null, null];
`;

export {
  program,
  tokens,
  ast,
  compiled,
};
