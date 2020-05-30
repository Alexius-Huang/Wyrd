import { Token, AST } from '../../types';
import { Var, Arithmetic, NumberLiteral, StringLiteral } from '../helper';
import { DataType as DT } from '../../parser/utils';

const tokens: Array<Token> = [
  { type: 'keyword', value: 'def' },
  { type: 'ident', value: 'add' },
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

  { type: 'keyword', value: 'def' },
  { type: 'builtin-type', value: 'Num' },
  { type: 'dot', value: '.' },
  { type: 'ident', value: 'add' },
  { type: 'lparen', value: '(' },
  { type: 'ident', value: 'y' },
  { type: 'colon', value: ':' },
  { type: 'builtin-type', value: 'Num' },
  { type: 'rparen', value: ')' },
  { type: 'colon', value: ':' },
  { type: 'builtin-type', value: 'Num' },
  { type: 'arrow', value: '=>' },
  { type: 'keyword', value: 'this' },
  { type: 'plus', value: '+' },
  { type: 'ident', value: 'y' },
  { type: 'newline', value: '\n' },
  { type: 'newline', value: '\n' },

  { type: 'ident', value: 'result' },
  { type: 'eq', value: '=' },
  { type: 'number', value: '123' },
  { type: 'pipe-op', value: '|>' },
  { type: 'ident', value: 'add' },
  { type: 'lparen', value: '(' },
  { type: 'number', value: '321' },
  { type: 'rparen', value: ')' },
  { type: 'pipe-op', value: '|>' },
  { type: 'builtin-type', value: 'Num' },
  { type: 'dot', value: '.' },
  { type: 'ident', value: 'add' },
  { type: 'lparen', value: '(' },
  { type: 'number', value: '456' },
  { type: 'rparen', value: ')' },
  { type: 'pipe-op', value: '|>' },
  { type: 'builtin-type', value: 'Num' },
  { type: 'dot', value: '.' },
  { type: 'ident', value: 'toStr' },
  { type: 'lparen', value: '(' },
  { type: 'rparen', value: ')' },
  { type: 'pipe-op', value: '|>' },
  { type: 'builtin-type', value: 'Str' },
  { type: 'dot', value: '.' },
  { type: 'ident', value: 'concat' },
  { type: 'lparen', value: '(' },
  { type: 'string', value: '666' },
  { type: 'rparen', value: ')' },
  { type: 'newline', value: '\n' },
];

const ast: AST = [
  {
    type: 'FunctionDeclaration',
    name: 'add',
    return: DT.Void,
    arguments: [
      { type: DT.Num, ident: 'x' },
      { type: DT.Num, ident: 'y' },
    ],
    body: [
      Arithmetic('x', '+', 'y'),
    ],
    outputType: DT.Num,
  },
  {
    type: 'MethodDeclaration',
    name: 'Num_add',
    return: DT.Void,
    receiverType: DT.Num,
    arguments: [
      { type: DT.Num, ident: 'y' },
    ],
    body: [
      Arithmetic('this', '+', 'y'),
    ],
    outputType: DT.Num,
  },
  {
    type: 'AssignmentExpr',
    return: DT.Void,
    expr1: Var('result', DT.Str),
    expr2: {
      type: 'MethodInvokeExpr',
      name: 'concat',
      isNotBuiltin: false,
      return: DT.Str,
      receiver: {
        type: 'MethodInvokeExpr',
        name: 'toString',
        isNotBuiltin: false,
        return: DT.Str,
        receiver: {
          type: 'MethodInvokeExpr',
          name: 'Num_add',
          return: DT.Num,
          isNotBuiltin: true,
          receiver: {
            type: 'FunctionInvokeExpr',
            name: 'add',
            return: DT.Num,
            params: [
              NumberLiteral(123),
              NumberLiteral(321),
            ],
          },
          params: [
            NumberLiteral(456), 
          ],
        },
        params: [],
      },
      params: [
        StringLiteral('666'),
      ],
    },
  },
];

const compiled = `\
function add(x, y) {
  return x + y;
}

function Num_add(_this, y) {
  return _this + y;
}

const result = Num_add(add(123, 321), 456).toString().concat('666');
`;

const minified = 'function add(x,y){return x+y;}function Num_add(_this,y){return _this+y;}const result=Num_add(add(123,321),456).toString().concat(\'666\');';

export {
  tokens,
  ast,
  compiled,
  minified,
};
