import { Token, AST } from '../../types';
import { NumberLiteral, Var, StringLiteral } from '../helper';
import { DataType as DT } from '../../parser/utils';

const tokens: Array<Token> = [
  { type: 'keyword', value: 'import' },
  { type: 'string', value: './Example.lib.wyrd' },
  { type: 'newline', value: '\n' },
  { type: 'newline', value: '\n' },

  { type: 'ident', value: 'foo' },
  { type: 'eq', value: '=' },
  { type: 'number', value: '666' },
  { type: 'dot', value: '.' },
  { type: 'ident', value: 'exampleMethod' },
  { type: 'lparen', value: '(' },
  { type: 'number', value: '666' },
  { type: 'comma', value: ',' },
  { type: 'string', value: 'Hello world!' },  
  { type: 'rparen', value: ')' },
  { type: 'newline', value: '\n' },
];

const ast: AST = [
  {
    type: 'AssignmentExpr',
    return: DT.Void,
    expr1: Var('foo', DT.Bool),
    expr2: {
      type: 'MethodInvokeExpr', 
      name: 'compiledMethod',
      receiver: NumberLiteral(666),
      return: DT.Bool,
      params: [
        NumberLiteral(666),
        StringLiteral('Hello world!'),
      ],
      isNotBuiltin: false,
    },
  },
];

const compiled = `\
const foo = (666).compiledMethod(666, 'Hello world!');
`;

const minified = '';

export {
  tokens,
  ast,
  compiled,
  minified,
};
