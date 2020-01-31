import { Token, AST } from '../../../types';

const program = `\
[[1 2 3] [4 5 6] [7 8 9]]
`;

const tokens: Array<Token> = [
  { type: 'lbracket', value: '[' },
  { type: 'lbracket', value: '[' },
  { type: 'number', value: '1' },
  { type: 'number', value: '2' },
  { type: 'number', value: '3' },
  { type: 'rbracket', value: ']' },
  { type: 'lbracket', value: '[' },
  { type: 'number', value: '4' },
  { type: 'number', value: '5' },
  { type: 'number', value: '6' },
  { type: 'rbracket', value: ']' },
  { type: 'lbracket', value: '[' },
  { type: 'number', value: '7' },
  { type: 'number', value: '8' },
  { type: 'number', value: '9' },
  { type: 'rbracket', value: ']' },
  { type: 'rbracket', value: ']' },
  { type: 'newline', value: '\n' },
];

const ast: AST = [
  {
    type: 'ListLiteral',
    values: [
      {
        type: 'ListLiteral',
        values: [
          { type: 'NumberLiteral', value: '1', returnType: 'Num' },
          { type: 'NumberLiteral', value: '2', returnType: 'Num' },
          { type: 'NumberLiteral', value: '3', returnType: 'Num' },
        ],
        elementType: 'Num',
        returnType: 'List[Num]',
      },    
      {
        type: 'ListLiteral',
        values: [
          { type: 'NumberLiteral', value: '4', returnType: 'Num' },
          { type: 'NumberLiteral', value: '5', returnType: 'Num' },
          { type: 'NumberLiteral', value: '6', returnType: 'Num' },
        ],
        elementType: 'Num',
        returnType: 'List[Num]',
      },    
      {
        type: 'ListLiteral',
        values: [
          { type: 'NumberLiteral', value: '7', returnType: 'Num' },
          { type: 'NumberLiteral', value: '8', returnType: 'Num' },
          { type: 'NumberLiteral', value: '9', returnType: 'Num' },
        ],
        elementType: 'Num',
        returnType: 'List[Num]',
      },    
    ],
    elementType: 'List[Num]',
    returnType: 'List[List[Num]]',
  },
];

const compiled = `\
[[1, 2, 3], [4, 5, 6], [7, 8, 9]];
`;

export {
  program,
  tokens,
  ast,
  compiled,
};
