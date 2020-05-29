import { Token, AST, CompilerOptions } from '../../types';
import { NumberLiteral, Var, Arithmetic } from '../helper';
import { DataType as DT, Scope } from '../../parser/utils';

const tokens: Array<Token> = [
  { type: 'ident', value: 'foo' },
  { type: 'eq', value: '=' },
  { type: 'keyword', value: 'if' },
  { type: 'ident', value: 'cond' },
  { type: 'keyword', value: 'do' },
  { type: 'newline', value: '\n' },

  { type: 'ident', value: 'a' },
  { type: 'eq', value: '=' },
  { type: 'number', value: '123' },
  { type: 'newline', value: '\n' },
  { type: 'ident', value: 'b' },
  { type: 'eq', value: '=' },
  { type: 'number', value: '456' },
  { type: 'newline', value: '\n' },
  { type: 'ident', value: 'a' },
  { type: 'plus', value: '+' },
  { type: 'ident', value: 'b' },
  { type: 'newline', value: '\n' },

  { type: 'keyword', value: 'else' },
  { type: 'keyword', value: 'do' },
  { type: 'newline', value: '\n' },

  { type: 'ident', value: 'a' },
  { type: 'eq', value: '=' },
  { type: 'number', value: '456' },
  { type: 'newline', value: '\n' },
  { type: 'ident', value: 'b' },
  { type: 'eq', value: '=' },
  { type: 'number', value: '789' },
  { type: 'newline', value: '\n' },
  { type: 'ident', value: 'b' },
  { type: 'dash', value: '-' },
  { type: 'ident', value: 'a' },
  { type: 'newline', value: '\n' },

  { type: 'keyword', value: 'end' },
  { type: 'newline', value: '\n' },
];

const ast: AST = [
  {
    type: 'AssignmentExpr',
    return: DT.Void,
    expr1: Var('foo', DT.Num),
    expr2: {
      type: 'ConditionalExpr',
      return: DT.Num,
      condition: Var('cond', DT.Bool),
      expr1: {
        type: 'DoBlockExpr',
        body: [
          {
            type: 'AssignmentExpr',
            return: DT.Void,
            expr1: Var('a', DT.Num),
            expr2: NumberLiteral(123),
          },
          {
            type: 'AssignmentExpr',
            return: DT.Void,
            expr1: Var('b', DT.Num),
            expr2: NumberLiteral(456),
          },
          Arithmetic('a', '+', 'b')
        ],
        return: DT.Num,
      },
      expr2: {
        type: 'DoBlockExpr',
        body: [
          {
            type: 'AssignmentExpr',
            return: DT.Void,
            expr1: Var('a', DT.Num),
            expr2: NumberLiteral(456),
          },
          {
            type: 'AssignmentExpr',
            return: DT.Void,
            expr1: Var('b', DT.Num),
            expr2: NumberLiteral(789),
          },
          Arithmetic('b', '-', 'a')
        ],
        return: DT.Num,
      },
    },
  },
];

const compiled = `\
const foo = cond ? (function () {
  const a = 123;
  const b = 456;
  return a + b;
})() : (function () {
  const a = 456;
  const b = 789;
  return b - a;
})();
`;

const minified = 'const foo=cond?(function(){const a=123;const b=456;return a+b;})():(function(){const a=456;const b=789;return b-a;})();';

const scope = (s: Scope): Scope => {
  s.createConstant('cond', DT.Bool);
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
