import { Token, AST } from '../../types';
import { StringLiteral } from '../helper';
import { DataType as DT } from '../../parser/classes';

const program = `\
"Hello world".concat("Wyrd-Lang".concat(" is awesome!"))
`;

const tokens: Array<Token> = [
  { type: 'string', value: 'Hello world' },
  { type: 'dot', value: '.' },
  { type: 'ident', value: 'concat' },
  { type: 'lparen', value: '(' },
  { type: 'string', value: 'Wyrd-Lang' },
  { type: 'dot', value: '.' },
  { type: 'ident', value: 'concat' },
  { type: 'lparen', value: '(' },
  { type: 'string', value: ' is awesome!' },
  { type: 'rparen', value: ')' },
  { type: 'rparen', value: ')' },
  { type: 'newline', value: '\n' },
];

const ast: AST = [
  {
    type: 'MethodInvokeExpr',
    name: 'concat',
    receiver: StringLiteral('Hello world'),
    params: [
      {
        type: 'MethodInvokeExpr',
        name: 'concat',
        receiver: StringLiteral('Wyrd-Lang'),
        params: [
          StringLiteral(' is awesome!'),
        ],
        return: DT.Str,
      },
    ],
    return: DT.Str,
  },
];

const compiled = `\
('Hello world').concat(('Wyrd-Lang').concat(' is awesome!'));
`;

const minified = '(\'Hello world\').concat((\'Wyrd-Lang\').concat(\' is awesome!\'));';

export {
  program,
  tokens,
  ast,
  compiled,
  minified,
};
