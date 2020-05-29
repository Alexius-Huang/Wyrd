import { Token, AST } from '../../../types';
import { DataType as DT } from '../../../parser/utils';
import * as helper from '../../helper';

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
      helper.NumberLiteral(1),
      helper.NumberLiteral(2),
      helper.NumberLiteral(3),
      helper.NumberLiteral(4),
      helper.NumberLiteral(5),
    ],
    elementType: DT.Num,
    return: DT.ListOf(DT.Num),
  },
  {
    type: 'ListLiteral',
    values: [
      helper.StringLiteral('Hello world'),
      helper.StringLiteral('Wyrd'),
      helper.StringLiteral('Lang'),
      helper.StringLiteral('is'),
      helper.StringLiteral('Awesome'),
    ],
    elementType: DT.Str,
    return: DT.ListOf(DT.Str),
  },
  {
    type: 'ListLiteral',
    values: [
      helper.BooleanLiteral(true),
      helper.BooleanLiteral(false),
      helper.BooleanLiteral(false),
      helper.BooleanLiteral(true),
      helper.BooleanLiteral(true),
      helper.BooleanLiteral(false),
      helper.BooleanLiteral(true),
    ],
    elementType: DT.Bool,
    return: DT.ListOf(DT.Bool),
  },
  {
    type: 'ListLiteral',
    values: [
      helper.NullLiteral(),
      helper.NullLiteral(),
      helper.NullLiteral(),
      helper.NullLiteral(),
      helper.NullLiteral(),
    ],
    elementType: DT.Null,
    return: DT.ListOf(DT.Null),
  },
];

const compiled = `\
[1, 2, 3, 4, 5];
['Hello world', 'Wyrd', 'Lang', 'is', 'Awesome'];
[true, false, false, true, true, false, true];
[null, null, null, null, null];
`;

const minified = '[1,2,3,4,5];[\'Hello world\',\'Wyrd\',\'Lang\',\'is\',\'Awesome\'];[true,false,false,true,true,false,true];[null,null,null,null,null];';

export {
  tokens,
  ast,
  compiled,
  minified,
};
