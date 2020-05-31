import { Token, AST } from '../../types';
import { NumberLiteral, Arithmetic, Var } from '../helper';
import { DataType as DT } from '../../parser/utils';

const tokens: Array<Token> = [
  { type: 'keyword', value: 'import' },
  { type: 'string', value: 'Math' },
  { type: 'newline', value: '\n' },
  { type: 'newline', value: '\n' },

  { type: 'ident', value: 'foo' },
  { type: 'eq', value: '=' },
  { type: 'number', value: '666' },
  { type: 'dot', value: '.' },
  { type: 'ident', value: 'square' },
  { type: 'lparen', value: '(' },
  { type: 'rparen', value: ')' },
  { type: 'newline', value: '\n' },
];

const ast: AST = [
  {
    type: 'MethodDeclaration',
    name: 'Num_square',
    receiverType: DT.Num,
    outputType: DT.Num,
    return: DT.Void,
    arguments: [],
    body: [
      Arithmetic('this', '*', 'this'),
    ],
  },
  {
    type: 'AssignmentExpr',
    return: DT.Void,
    expr1: Var('foo', DT.Num),
    expr2: {
      type: 'MethodInvokeExpr', 
      name: 'Num_square',
      receiver: NumberLiteral(666),
      return: DT.Num,
      params: [],
      isNotBuiltin: true,
    },
  },
];

const compiled = `\
function Num_square(_this) {
  return _this * _this;
}

const foo = Num_square(666);
`;

const minified = '';

export {
  tokens,
  ast,
  compiled,
  minified,
};
