import { Token, AST, CompilerOptions } from '../../types';
import { DataType as DT, Scope, Parameter } from '../../parser/utils';
import { StringLiteral } from '../helper';

const tokens: Array<Token> = [
  { type: 'ident', value: 'funcA' },
  { type: 'lparen', value: '(' },
  { type: 'string', value: 'Hello world' },
  { type: 'rparen', value: ')' },
  { type: 'dot', value: '.' },
  { type: 'ident', value: 'concat' },
  { type: 'lparen', value: '(' },
  { type: 'string', value: 'Hello world again' },
  { type: 'rparen', value: ')' },
  { type: 'dot', value: '.' },
  { type: 'ident', value: 'upcase' },
  { type: 'lparen', value: '(' },
  { type: 'rparen', value: ')' },
  { type: 'newline', value: '\n' },

  { type: 'lparen', value: '(' },
  { type: 'ident', value: 'funcA' },
  { type: 'lparen', value: '(' },
  { type: 'string', value: 'Hello world' },
  { type: 'rparen', value: ')' },
  { type: 'dot', value: '.' },
  { type: 'ident', value: 'concat' },
  { type: 'lparen', value: '(' },
  { type: 'string', value: 'Hello world again' },
  { type: 'rparen', value: ')' },
  { type: 'rparen', value: ')' },
  { type: 'dot', value: '.' },
  { type: 'ident', value: 'upcase' },
  { type: 'lparen', value: '(' },
  { type: 'rparen', value: ')' },
  { type: 'newline', value: '\n' },
];

const ast: AST = [
  {
    type: 'MethodInvokeExpr',
    name: 'toUpperCase',
    return: DT.Str,
    receiver: {
      type: 'MethodInvokeExpr',
      name: 'concat',
      return: DT.Str,
      receiver: {
        type: 'FunctionInvokeExpr',
        name: 'funcA',
        params: [
          StringLiteral('Hello world'),
        ],
        return: DT.Str,
      },
      params: [
        StringLiteral('Hello world again')
      ]
    },
    params: [],
  },
  {
    type: 'MethodInvokeExpr',
    name: 'toUpperCase',
    return: DT.Str,
    receiver: {
      type: 'MethodInvokeExpr',
      name: 'concat',
      return: DT.Str,
      receiver: {
        type: 'FunctionInvokeExpr',
        name: 'funcA',
        params: [
          StringLiteral('Hello world'),
        ],
        return: DT.Str,
      },
      params: [
        StringLiteral('Hello world again')
      ]
    },
    params: [],
  },
];

const compiled = `\
funcA('Hello world').concat('Hello world again').toUpperCase();
funcA('Hello world').concat('Hello world again').toUpperCase();
`;

const minified = '';

const scope = (s: Scope): Scope => {
  const funcA = s.createFunction('funcA');
  funcA.createNewPattern(Parameter.of(DT.Str), DT.Str);
  return s;  
};

const compilerOptions: CompilerOptions = { scopeMiddleware: scope };

export {
  tokens,
  ast,
  compiled,
  compilerOptions,
  minified,
};
