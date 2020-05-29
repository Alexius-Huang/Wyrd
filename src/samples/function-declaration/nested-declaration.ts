import { Token, AST, Operator as Op } from '../../types';
import { NumberLiteral, Arithmetic, Var } from '../helper';
import { DataType as DT } from '../../parser/utils';

const tokens: Array<Token> = [
  { type: 'keyword', value: 'def' },
  { type: 'ident', value: 'foo' },
  { type: 'lparen', value: '(' },
  { type: 'ident', value: 'x' },
  { type: 'colon', value: ':' },
  { type: 'builtin-type', value: 'Num' },
  { type: 'rparen', value: ')' },
  { type: 'colon', value: ':' },
  { type: 'builtin-type', value: 'Num' },
  { type: 'keyword', value: 'do' },
  { type: 'newline', value: '\n' },

  { type: 'keyword', value: 'def' },
  { type: 'ident', value: 'bar' },
  { type: 'lparen', value: '(' },
  { type: 'ident', value: 'y' },
  { type: 'colon', value: ':' },
  { type: 'builtin-type', value: 'Num' },
  { type: 'rparen', value: ')' },
  { type: 'colon', value: ':' },
  { type: 'builtin-type', value: 'Num' },
  { type: 'keyword', value: 'do' },
  { type: 'newline', value: '\n' },

  { type: 'ident', value: 'a' },
  { type: 'eq', value: '=' },
  { type: 'ident', value: 'y' },
  { type: 'asterisk', value: '*' },
  { type: 'number', value: '2' },
  { type: 'newline', value: '\n' },

  { type: 'keyword', value: 'def' },
  { type: 'ident', value: 'baz' },
  { type: 'lparen', value: '(' },
  { type: 'ident', value: 'z' },
  { type: 'colon', value: ':' },
  { type: 'builtin-type', value: 'Num' },
  { type: 'rparen', value: ')' },
  { type: 'colon', value: ':' },
  { type: 'builtin-type', value: 'Num' },
  { type: 'arrow', value: '=>' },
  { type: 'ident', value: 'z' },
  { type: 'plus', value: '+' },
  { type: 'number', value: '666' },
  { type: 'newline', value: '\n' },

  { type: 'ident', value: 'baz' },
  { type: 'lparen', value: '(' },
  { type: 'ident', value: 'a' },
  { type: 'rparen', value: ')' },
  { type: 'newline', value: '\n' },

  { type: 'keyword', value: 'end' },
  { type: 'newline', value: '\n' },

  { type: 'ident', value: 'x' },
  { type: 'plus', value: '+' },
  { type: 'ident', value: 'bar' },
  { type: 'lparen', value: '(' },
  { type: 'ident', value: 'x' },
  { type: 'rparen', value: ')' },
  { type: 'asterisk', value: '*' },
  { type: 'number', value: '123' },
  { type: 'newline', value: '\n' },

  { type: 'keyword', value: 'end' },
  { type: 'newline', value: '\n' }
];

const ast: AST = [
  {
    type: 'FunctionDeclaration',
    return: DT.Void,
    name: 'foo',
    arguments: [
      { ident: 'x', type: DT.Num },
    ],
    outputType: DT.Num,
    body: [
      {
        type: 'FunctionDeclaration',
        return: DT.Void,
        name: 'bar',
        arguments: [
          { ident: 'y', type: DT.Num },
        ],
        outputType: DT.Num,
        body: [
          {
            type: 'AssignmentExpr',
            return: DT.Void,
            expr1: Var('a', DT.Num),
            expr2: Arithmetic('y', '*',  2)
          },
          {
            type: 'FunctionDeclaration',
            return: DT.Void,
            name: 'baz',
            arguments: [
              { ident: 'z', type: DT.Num }
            ],
            outputType: DT.Num,
            body: [
              Arithmetic('z', '+', 666)
            ],
          },
          {
            type: 'FunctionInvokeExpr',
            return: DT.Num,
            name: 'baz',
            params: [
              Var('a', DT.Num)
            ],
          },
        ],
      },
      {
        type: 'BinaryOpExpr',
        return: DT.Num,
        operator: Op.Plus,
        expr1: Var('x', DT.Num),
        expr2: {
          type: 'BinaryOpExpr',
          return: DT.Num,
          operator: Op.Asterisk,
          expr1: {
            type: 'FunctionInvokeExpr',
            return: DT.Num,
            name: 'bar',
            params: [
              Var('x', DT.Num),
            ],
          },
          expr2: NumberLiteral(123),
        },
      },
    ],
  },
];

const compiled = `\
function foo(x) {
  function bar(y) {
    const a = y * 2;
    function baz(z) {
      return z + 666;
    };
    return baz(a);
  };
  return x + (bar(x) * 123);
}

`;

const minified = 'function foo(x){function bar(y){const a=y*2;function baz(z){return z+666;};return baz(a);};return x+(bar(x)*123);}';

export {
  tokens,
  ast,
  compiled,
  minified,
};
