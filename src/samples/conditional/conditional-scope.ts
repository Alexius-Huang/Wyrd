import { Token, AST, Operator, CompilerOptions } from '../../types';
import { Arithmetic, Var, BooleanLiteral, StringLiteral, NumberLiteral, DeclareConst, DeclareVar } from '../helper';
import { DataType as DT, Scope } from '../../parser/utils';

const tokens: Array<Token> = [
  { type: 'builtin-type', value: 'Num' },
  { type: 'ident', value: 'foo' },
  { type: 'eq', value: '=' },
  { type: 'number', value: '123' },
  { type: 'newline', value: '\n' },

  { type: 'keyword', value: 'mutable' },
  { type: 'builtin-type', value: 'Num' },
  { type: 'ident', value: 'bar' },
  { type: 'eq', value: '=' },
  { type: 'number', value: '456' },
  { type: 'newline', value: '\n' },
  { type: 'newline', value: '\n' },

  { type: 'keyword', value: 'if' },
  { type: 'ident', value: 'cond1' },
  { type: 'keyword', value: 'do' },
  { type: 'newline', value: '\n' },
  { type: 'builtin-type', value: 'Num' },
  { type: 'ident', value: 'foo' },
  { type: 'eq', value: '=' },
  { type: 'number', value: '456' },
  { type: 'newline', value: '\n' },
  { type: 'keyword', value: 'mutable' },
  { type: 'builtin-type', value: 'Num' },
  { type: 'ident', value: 'bar' },
  { type: 'eq', value: '=' },
  { type: 'number', value: '789' },
  { type: 'newline', value: '\n' },
  { type: 'ident', value: 'foo' },
  { type: 'plus', value: '+' },
  { type: 'ident', value: 'bar' },
  { type: 'newline', value: '\n' },

  { type: 'keyword', value: 'elif' },
  { type: 'ident', value: 'cond2' },
  { type: 'keyword', value: 'do' },
  { type: 'newline', value: '\n' },
  { type: 'builtin-type', value: 'Num' },
  { type: 'ident', value: 'foo' },
  { type: 'eq', value: '=' },
  { type: 'number', value: '321' },
  { type: 'newline', value: '\n' },
  { type: 'keyword', value: 'mutable' },
  { type: 'builtin-type', value: 'Num' },
  { type: 'ident', value: 'bar' },
  { type: 'eq', value: '=' },
  { type: 'number', value: '123' },
  { type: 'newline', value: '\n' },
  { type: 'ident', value: 'foo' },
  { type: 'plus', value: '+' },
  { type: 'ident', value: 'bar' },
  { type: 'newline', value: '\n' },
  
  { type: 'keyword', value: 'else' },
  { type: 'keyword', value: 'do' },
  { type: 'newline', value: '\n' },
  { type: 'builtin-type', value: 'Num' },
  { type: 'ident', value: 'foo' },
  { type: 'eq', value: '=' },
  { type: 'number', value: '333' },
  { type: 'newline', value: '\n' },
  { type: 'keyword', value: 'mutable' },
  { type: 'builtin-type', value: 'Num' },
  { type: 'ident', value: 'bar' },
  { type: 'eq', value: '=' },
  { type: 'number', value: '666' },
  { type: 'newline', value: '\n' },
  { type: 'ident', value: 'foo' },
  { type: 'plus', value: '+' },
  { type: 'ident', value: 'bar' },
  { type: 'newline', value: '\n' },
  { type: 'keyword', value: 'end' },
  { type: 'newline', value: '\n' },
];

const ast: AST = [
  DeclareConst('foo', NumberLiteral(123)),
  DeclareVar('bar', NumberLiteral(456)),
  {
    type: 'ConditionalExpr',
    return: DT.Num,
    condition: Var('cond1', DT.Bool),
    expr1: {
      type: 'DoBlockExpr',
      return: DT.Num,
      body: [
        DeclareConst('foo', NumberLiteral(456)),
        DeclareVar('bar', NumberLiteral(789)),
        Arithmetic('foo', '+', 'bar'),
      ],
    },
    expr2: {
      type: 'ConditionalExpr',
      return: DT.Num,
      condition: Var('cond2', DT.Bool),
      expr1: {
        type: 'DoBlockExpr',
        return: DT.Num,
        body: [
          DeclareConst('foo', NumberLiteral(321)),
          DeclareVar('bar', NumberLiteral(123)),
          Arithmetic('foo', '+', 'bar'),
        ],
      },
      expr2: {
        type: 'DoBlockExpr',
        return: DT.Num,
        body: [
          DeclareConst('foo', NumberLiteral(333)),
          DeclareVar('bar', NumberLiteral(666)),
          Arithmetic('foo', '+', 'bar'),
        ],
      },
    },
  },
];

const compiled = `\
const foo = 123;
let bar = 456;
cond1 ? (function () {
  const foo = 456;
  let bar = 789;
  return foo + bar;
})() : (cond2 ? (function () {
  const foo = 321;
  let bar = 123;
  return foo + bar;
})() : (function () {
  const foo = 333;
  let bar = 666;
  return foo + bar;
})());
`;

const minified = '';

const compilerOptions: CompilerOptions = {
  scopeMiddleware(scope: Scope): Scope {
    scope.createConstant('cond1', DT.Bool);
    scope.createConstant('cond2', DT.Bool);
    return scope;
  }
}

export {
  tokens,
  ast,
  compiled,
  minified,
  compilerOptions
};
