import { Token, AST, Operator as Op } from '../../types';
import { NumberLiteral, prioritize, Arithmetic } from '../helper';
import { DataType as DT } from '../../parser/utils';

const program = `\
def Num.isPositive: Bool => this > 0

123.isPositive()
Num.isPositive(123)
`;

// TODO: More Test Samples
`def Num.add(x: Num): Num => this + x`;

const tokens: Array<Token> = [
  { type: 'keyword', value: 'def' },
  { type: 'builtin-type', value: 'Num' },
  { type: 'dot', value: '.' },
  { type: 'ident', value: 'isPositive' },
  { type: 'colon', value: ':' },
  { type: 'builtin-type', value: 'Bool' },
  { type: 'arrow', value: '=>' },
  { type: 'keyword', value: 'this' },
  { type: 'gt', value: '>' },
  { type: 'number', value: '0' },
  { type: 'newline', value: '\n' },
  { type: 'newline', value: '\n' },

  { type: 'number', value: '123' },
  { type: 'dot', value: '.' },
  { type: 'ident', value: 'isPositive' },
  { type: 'lparen', value: '(' },
  { type: 'rparen', value: ')' },
  { type: 'newline', value: '\n' },

  { type: 'builtin-type', value: 'Num' },
  { type: 'dot', value: '.' },
  { type: 'ident', value: 'isPositive' },
  { type: 'lparen', value: '(' },
  { type: 'number', value: '123' },
  { type: 'rparen', value: ')' },
  { type: 'newline', value: '\n' },
];

const ast: AST = [
  {
    type: 'MethodDeclaration',
    receiverType: DT.Num,
    name: 'Num_isPositive',
    return: DT.Void,
    arguments: [],
    outputType: DT.Bool,
    body: [
      {
        type: 'BinaryOpExpr',
        operator: Op.Gt,
        return: DT.Bool,
        expr1: { type: 'ThisLiteral', return: DT.Num },
        expr2: NumberLiteral(0),
      },
    ],
  },
  {
    type: 'MethodInvokeExpr',
    name: 'Num_isPositive',
    receiver: NumberLiteral(123),
    params: [],
    return: DT.Bool,
    isNotBuiltin: true,
  },
  {
    type: 'MethodInvokeExpr',
    name: 'Num_isPositive',
    receiver: NumberLiteral(123),
    params: [],
    return: DT.Bool,
    isNotBuiltin: true,
  },
];

const compiled = `\
function Num_isPositive(_this) {
  return _this > 0;
}

Num_isPositive(123);
Num_isPositive(123);
`;

const minified = 'TODO';

export {
  program,
  tokens,
  ast,
  compiled,
  minified,
};
