import { Token, AST, CompilerOptions } from '../../types';
import { NumberLiteral, Var, Arithmetic } from '../helper';
import { DataType as DT, Scope } from '../../parser/utils';
import { VoidExpression } from '../../parser/constants';

const tokens: Array<Token> = [
  { type: 'keyword', value: 'if' },
  { type: 'ident', value: 'cond' },
  { type: 'keyword', value: 'do' },
  { type: 'newline', value: '\n' },

  { type: 'builtin-type', value: 'Num' },
  { type: 'ident', value: 'a' },
  { type: 'eq', value: '=' },
  { type: 'number', value: '123' },
  { type: 'newline', value: '\n' },
  { type: 'builtin-type', value: 'Num' },
  { type: 'ident', value: 'b' },
  { type: 'eq', value: '=' },
  { type: 'number', value: '456' },
  { type: 'newline', value: '\n' },
  { type: 'ident', value: 'a' },
  { type: 'plus', value: '+' },
  { type: 'ident', value: 'b' },
  { type: 'newline', value: '\n' },

  { type: 'keyword', value: 'end' },
  { type: 'newline', value: '\n' },
];

const ast: AST = [
  {
    type: 'ConditionalExpr',
    return: DT.Maybe.Num,
    condition: Var('cond', DT.Bool),
    expr1: {
      type: 'DoBlockExpr',
      body: [
        {
          type: 'ConstDeclaration',
          return: DT.Void,
          expr1: Var('a', DT.Num),
          expr2: NumberLiteral(123),
        },
        {
          type: 'ConstDeclaration',
          return: DT.Void,
          expr1: Var('b', DT.Num),
          expr2: NumberLiteral(456),
        },
        Arithmetic('a', '+', 'b')
      ],
      return: DT.Num,
    },
    expr2: VoidExpression,
  }
];

const compiled = `\
cond ? (function () {
  const a = 123;
  const b = 456;
  return a + b;
})() : null;
`;

const minified = 'cond?(function(){const a=123;const b=456;return a+b;})():null;';

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
