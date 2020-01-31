import { Token, AST, Operator as Op, ParseOptions } from '../../types';
import { createFunctionPatterns } from '../helper';

const program = `\
def addition(x: Num, y: Num): Num => x + y
addition(1, 2)
`;

const tokens: Array<Token> = [
  { type: 'keyword', value: 'def' },
  { type: 'ident', value: 'addition' },
  { type: 'lparen', value: '(' },
  { type: 'ident', value: 'x' },
  { type: 'colon', value: ':' },
  { type: 'builtin-type', value: 'Num' },
  { type: 'comma', value: ',' },
  { type: 'ident', value: 'y' },
  { type: 'colon', value: ':' },
  { type: 'builtin-type', value: 'Num' },
  { type: 'rparen', value: ')' },
  { type: 'colon', value: ':' },
  { type: 'builtin-type', value: 'Num' },
  { type: 'arrow', value: '=>' },
  { type: 'ident', value: 'x' },
  { type: 'plus', value: '+' },
  { type: 'ident', value: 'y' },
  { type: 'newline', value: '\n' },

  { type: 'ident', value: 'addition' },
  { type: 'lparen', value: '(' },
  { type: 'number', value: '1' },
  { type: 'comma', value: ',' },
  { type: 'number', value: '2' },
  { type: 'rparen', value: ')' },
  { type: 'newline', value: '\n' },
];

const ast: AST = [
  {
    type: 'FunctionDeclaration',
    name: 'addition',
    returnType: 'Void',
    arguments: [
      { ident: 'x', type: 'Num' },
      { ident: 'y', type: 'Num' }
    ],
    outputType: 'Num',
    body: [
      {
        type: 'BinaryOpExpr',
        operator: Op.Plus,
        returnType: 'Num',
        expr1: { type: 'IdentLiteral', value: 'x', returnType: 'Num' },
        expr2: { type: 'IdentLiteral', value: 'y', returnType: 'Num' }
      },
    ],
  },
  {
    type: 'FunctionInvokeExpr',
    name: 'addition',
    params: [
      { type: 'NumberLiteral', value: '1', returnType: 'Num' },
      { type: 'NumberLiteral', value: '2', returnType: 'Num' },
    ],
    returnType: 'Num',
  },
];

const compiled = `\
function addition(x, y) {
  return x + y;
}

addition(1, 2);
`;

const parseOptions: ParseOptions = {
  functions: createFunctionPatterns([
  ]),
};

export {
  program,
  tokens,
  ast,
  compiled,
  parseOptions,
};
