import { Token, AST } from '../../types';
import { NumberLiteral, Var, Arithmetic } from '../helper';

const program = `\
mutable something = 1
def addSomething(x: Num): Num => x + something
something = 2
`;

const tokens: Array<Token> = [
  { type: 'keyword', value: 'mutable' },
  { type: 'ident', value: 'something' },
  { type: 'eq', value: '=' },
  { type: 'number', value: '1' },
  { type: 'newline', value: '\n' },

  { type: 'keyword', value: 'def' },
  { type: 'ident', value: 'addSomething' },
  { type: 'lparen', value: '(' },
  { type: 'ident', value: 'x' },
  { type: 'colon', value: ':' },
  { type: 'builtin-type', value: 'Num' },
  { type: 'rparen', value: ')' },
  { type: 'colon', value: ':' },
  { type: 'builtin-type', value: 'Num' },
  { type: 'arrow', value: '=>' },
  { type: 'ident', value: 'x' },
  { type: 'plus', value: '+' },
  { type: 'ident', value: 'something' },
  { type: 'newline', value: '\n' },

  { type: 'ident', value: 'something' },
  { type: 'eq', value: '=' },
  { type: 'number', value: '2' },
  { type: 'newline', value: '\n' },
];

const ast: AST = [
  {
    type: 'VarDeclaration',
    returnType: 'Void',
    expr1: Var('something', 'Num'),
    expr2: NumberLiteral('1')
  },
  {
    type: 'FunctionDeclaration',
    name: 'addSomething',
    arguments: [
      { ident: 'x', type: 'Num' },
    ],
    outputType: 'Num',
    body: [
      Arithmetic('x', '+', 'something'),
    ],
    returnType: 'Void',
  },
  {
    type: 'VarAssignmentExpr',
    returnType: 'Void',
    expr1: Var('something', 'Num'),
    expr2: NumberLiteral('2'),
  },
];

const compiled = `\
let something = 1;
function addSomething(x) {
  return x + something;
}

something = 2;
`;

const minified = 'let something=1;function addSomething(x){return x+something;}something=2;';

export {
  program,
  tokens,
  ast,
  compiled,
  minified,
};
