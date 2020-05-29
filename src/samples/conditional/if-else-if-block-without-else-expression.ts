import { Token, AST, CompilerOptions } from '../../types';
import { NumberLiteral, Var, Arithmetic, StringLiteral } from '../helper';
import { DataType as DT, Scope } from '../../parser/utils';
import { VoidExpression } from '../../parser/constants';

const tokens: Array<Token> = [
  { type: 'ident', value: 'example' },
  { type: 'eq', value: '=' },
  { type: 'keyword', value: 'if' },
  { type: 'ident', value: 'cond1' },
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
  { type: 'lparen', value: '(' },
  { type: 'ident', value: 'a' },
  { type: 'plus', value: '+' },
  { type: 'ident', value: 'b' },
  { type: 'rparen', value: ')' },
  { type: 'dot', value: '.' },
  { type: 'ident', value: 'toStr' },
  { type: 'lparen', value: '(' },
  { type: 'rparen', value: ')' },
  { type: 'newline', value: '\n' },

  { type: 'keyword', value: 'elif' },
  { type: 'ident', value: 'cond2' },
  { type: 'keyword', value: 'do' },
  { type: 'newline', value: '\n' },

  { type: 'ident', value: 'foo' },
  { type: 'eq', value: '=' },
  { type: 'string', value: 'Hello' },
  { type: 'newline', value: '\n' },
  { type: 'ident', value: 'bar' },
  { type: 'eq', value: '=' },
  { type: 'number', value: '123' },
  { type: 'newline', value: '\n' },
  { type: 'ident', value: 'foo' },
  { type: 'dot', value: '.' },
  { type: 'ident', value: 'concat' },
  { type: 'lparen', value: '(' },
  { type: 'ident', value: 'bar' },
  { type: 'dot', value: '.' },
  { type: 'ident', value: 'toStr' },
  { type: 'lparen', value: '(' },
  { type: 'rparen', value: ')' },
  { type: 'rparen', value: ')' },
  { type: 'newline', value: '\n' },

  { type: 'keyword', value: 'elif' },
  { type: 'ident', value: 'cond3' },
  { type: 'keyword', value: 'do' },
  { type: 'newline', value: '\n' },

  { type: 'ident', value: 'baz' },
  { type: 'eq', value: '=' },
  { type: 'number', value: '666' },
  { type: 'newline', value: '\n' },
  { type: 'ident', value: 'bazz' },
  { type: 'eq', value: '=' },
  { type: 'string', value: 'Devil Number: ' },
  { type: 'newline', value: '\n' },
  { type: 'ident', value: 'bazz' },
  { type: 'dot', value: '.' },
  { type: 'ident', value: 'concat' },
  { type: 'lparen', value: '(' },
  { type: 'ident', value: 'baz' },
  { type: 'dot', value: '.' },
  { type: 'ident', value: 'toStr' },
  { type: 'lparen', value: '(' },
  { type: 'rparen', value: ')' },
  { type: 'rparen', value: ')' },
  { type: 'newline', value: '\n' },

  { type: 'keyword', value: 'end' },
  { type: 'newline', value: '\n' },
];

const ast: AST = [
  {
    type: 'AssignmentExpr',
    return: DT.Void,
    expr1: Var('example', DT.Maybe.Str),
    expr2: {
      type: 'ConditionalExpr',
      return: DT.Maybe.Str,
      condition: Var('cond1', DT.Bool),
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
          {
            type: 'MethodInvokeExpr',
            name: 'toString',
            receiver: Arithmetic('a', '+', 'b'),
            params: [],
            return: DT.Str,
          },
        ],
        return: DT.Str,
      },
      expr2: {
        type: 'ConditionalExpr',
        return: DT.Maybe.Str,
        condition: Var('cond2', DT.Bool),
        expr1: {
          type: 'DoBlockExpr',
          body: [
            {
              type: 'AssignmentExpr',
              return: DT.Void,
              expr1: Var('foo', DT.Str),
              expr2: StringLiteral('Hello')
            },
            {
              type: 'AssignmentExpr',
              return: DT.Void,
              expr1: Var('bar', DT.Num),
              expr2: NumberLiteral(123),
            },
            {
              type: 'MethodInvokeExpr',
              name: 'concat',
              receiver: Var('foo', DT.Str),
              params: [
                {
                  type: 'MethodInvokeExpr',
                  name: 'toString',
                  receiver: Var('bar', DT.Num),
                  params: [],
                  return: DT.Str,
                },
              ],
              return: DT.Str,
            },
          ],
          return: DT.Str
        },
        expr2: {
          type: 'ConditionalExpr',
          return: DT.Maybe.Str,
          condition: Var('cond3', DT.Bool),
          expr1: {
            type: 'DoBlockExpr',
            body: [
              {
                type: 'AssignmentExpr',
                return: DT.Void,
                expr1: Var('baz', DT.Num),
                expr2: NumberLiteral(666)
              },
              {
                type: 'AssignmentExpr',
                return: DT.Void,
                expr1: Var('bazz', DT.Str),
                expr2: StringLiteral('Devil Number: '),
              },
              {
                type: 'MethodInvokeExpr',
                name: 'concat',
                receiver: Var('bazz', DT.Str),
                params: [
                  {
                    type: 'MethodInvokeExpr',
                    name: 'toString',
                    receiver: Var('baz', DT.Num),
                    params: [],
                    return: DT.Str,
                  },
                ],
                return: DT.Str,
              },  
            ],
            return: DT.Str
          },
          expr2: VoidExpression,
        },
      },
    },
  },
];

const compiled = `\
const example = cond1 ? (function () {
  const a = 123;
  const b = 456;
  return (a + b).toString();
})() : (cond2 ? (function () {
  const foo = 'Hello';
  const bar = 123;
  return foo.concat(bar.toString());
})() : (cond3 ? (function () {
  const baz = 666;
  const bazz = 'Devil Number: ';
  return bazz.concat(baz.toString());
})() : null));
`;

const minified = 'const example=cond1?(function(){const a=123;const b=456;return (a+b).toString();})():(cond2?(function(){const foo=\'Hello\';const bar=123;return foo.concat(bar.toString());})():(cond3?(function(){const baz=666;const bazz=\'Devil Number: \';return bazz.concat(baz.toString());})():null));';

const scope = (s: Scope): Scope => {
  s.createConstant('cond1', DT.Bool);
  s.createConstant('cond2', DT.Bool);
  s.createConstant('cond3', DT.Bool);
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
