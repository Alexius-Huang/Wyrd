import { Token, AST } from '../../../types';
import { NumberLiteral } from '../../helper';
import { DataType as DT } from '../../../parser/utils';

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
          NumberLiteral(1),
          NumberLiteral(2),
          NumberLiteral(3),
        ],
        elementType: DT.Num,
        return: DT.ListOf(DT.Num),
      },    
      {
        type: 'ListLiteral',
        values: [
          NumberLiteral(4),
          NumberLiteral(5),
          NumberLiteral(6),
        ],
        elementType: DT.Num,
        return: DT.ListOf(DT.Num),
      },    
      {
        type: 'ListLiteral',
        values: [
          NumberLiteral(7),
          NumberLiteral(8),
          NumberLiteral(9),
        ],
        elementType: DT.Num,
        return: DT.ListOf(DT.Num),
      },    
    ],
    elementType: DT.ListOf(DT.Num),
    return: DT.ListOf(DT.ListOf(DT.Num)),
  },
];

const compiled = `\
[[1, 2, 3], [4, 5, 6], [7, 8, 9]];
`;

const minified = '[[1,2,3],[4,5,6],[7,8,9]];';

export {
  tokens,
  ast,
  compiled,
  minified,
};
