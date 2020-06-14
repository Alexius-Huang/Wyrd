import { Token, AST, Operator as Op } from '../../types';
import { NumberLiteral, StringLiteral, BooleanLiteral, Var, ThisLiteral } from '../helper';
import { DataType as DT } from '../../parser/utils';

const tokens: Array<Token> = [
  { type: 'keyword', value: 'record' },
  { type: 'ident', value: 'UserInfo' },
  { type: 'lcurly', value: '{' },
  { type: 'newline', value: '\n' },
  { type: 'builtin-type', value: 'Str' },
  { type: 'ident', value: 'name' },
  { type: 'comma', value: ',' },
  { type: 'newline', value: '\n' },
  { type: 'builtin-type', value: 'Num' },
  { type: 'ident', value: 'age' },
  { type: 'comma', value: ',' },
  { type: 'newline', value: '\n' },
  { type: 'builtin-type', value: 'Bool' },
  { type: 'ident', value: 'hasPet' },
  { type: 'newline', value: '\n' },
  { type: 'rcurly', value: '}' },
  { type: 'newline', value: '\n' },
  { type: 'newline', value: '\n' },

  { type: 'keyword', value: 'def' },
  { type: 'ident', value: 'UserInfo' },
  { type: 'dot', value: '.' },
  { type: 'ident', value: 'isAdult' },
  { type: 'colon', value: ':' },
  { type: 'builtin-type', value: 'Bool' },
  { type: 'arrow', value: '=>' },
  { type: 'keyword', value: 'this' },
  { type: 'ref', value: '->' },
  { type: 'ident', value: 'age' },
  { type: 'gt', value: '>' },
  { type: 'number', value: '20' },
  { type: 'newline', value: '\n' },

  { type: 'keyword', value: 'def' },
  { type: 'ident', value: 'UserInfo' },
  { type: 'dot', value: '.' },
  { type: 'ident', value: 'greetWith' },
  { type: 'lparen', value: '(' },
  { type: 'ident', value: 'msg' },
  { type: 'colon', value: ':' },
  { type: 'builtin-type', value: 'Str' },
  { type: 'rparen', value: ')' },
  { type: 'colon', value: ':' },
  { type: 'builtin-type', value: 'Str' },
  { type: 'arrow', value: '=>' },
  { type: 'ident', value: 'msg' },
  { type: 'dot', value: '.' },
  { type: 'ident', value: 'concat' },
  { type: 'lparen', value: '(' },
  { type: 'keyword', value: 'this' },
  { type: 'ref', value: '->' },
  { type: 'ident', value: 'name' },
  { type: 'rparen', value: ')' },
  { type: 'newline', value: '\n' },
  { type: 'newline', value: '\n' },

  { type: 'ident', value: 'UserInfo' },
  { type: 'ident', value: 'maxwell' },
  { type: 'eq', value: '=' },
  { type: 'ident', value: 'UserInfo' },
  { type: 'lcurly', value: '{' },
  { type: 'newline', value: '\n' },
  { type: 'ident', value: 'name' },
  { type: 'colon', value: ':' },
  { type: 'string', value: 'Maxwell' },
  { type: 'comma', value: ',' },
  { type: 'newline', value: '\n' },
  { type: 'ident', value: 'age' },
  { type: 'colon', value: ':' },
  { type: 'number', value: '18' },
  { type: 'comma', value: ',' },
  { type: 'newline', value: '\n' },
  { type: 'ident', value: 'hasPet' },
  { type: 'colon', value: ':' },
  { type: 'boolean', value: 'False' },
  { type: 'newline', value: '\n' },
  { type: 'rcurly', value: '}' },
  { type: 'newline', value: '\n' },
  { type: 'newline', value: '\n' },

  { type: 'ident', value: 'maxwell' },
  { type: 'dot', value: '.' },
  { type: 'ident', value: 'isAdult' },
  { type: 'lparen', value: '(' },
  { type: 'rparen', value: ')' },
  { type: 'newline', value: '\n' },
  { type: 'ident', value: 'maxwell' },
  { type: 'dot', value: '.' },
  { type: 'ident', value: 'greetWith' },
  { type: 'lparen', value: '(' },
  { type: 'string', value: 'Hello! ' },
  { type: 'rparen', value: ')' },
  { type: 'newline', value: '\n' },

  { type: 'ident', value: 'UserInfo' },
  { type: 'dot', value: '.' },
  { type: 'ident', value: 'isAdult' },
  { type: 'lparen', value: '(' },
  { type: 'ident', value: 'maxwell' },
  { type: 'rparen', value: ')' },
  { type: 'newline', value: '\n' },

  { type: 'ident', value: 'UserInfo' },
  { type: 'dot', value: '.' },
  { type: 'ident', value: 'greetWith' },
  { type: 'lparen', value: '(' },
  { type: 'ident', value: 'maxwell' },
  { type: 'comma', value: ',' },
  { type: 'string', value: 'Hello! ' },
  { type: 'rparen', value: ')' },
  { type: 'newline', value: '\n' },
];

const ast: AST = [
  {
    type: 'MethodDeclaration',
    return: DT.Void,
    name: 'UserInfo_isAdult',
    receiverType: new DT('UserInfo'),
    outputType: DT.Bool,
    arguments: [],
    body: [
      {
        type: 'BinaryOpExpr',
        return: DT.Bool,
        operator: Op.Gt,
        expr1: {
          type: 'RecordReferenceExpr',
          return: DT.Num,
          property: 'age',
          recordExpr: ThisLiteral(new DT('UserInfo')),
        },
        expr2: NumberLiteral(20),
      },
    ],
  },
  {
    type: 'MethodDeclaration',
    return: DT.Void,
    name: 'UserInfo_greetWith',
    receiverType: new DT('UserInfo'),
    outputType: DT.Str,
    arguments: [
      { ident: 'msg', type: DT.Str }
    ],
    body: [
      {
        type: 'MethodInvokeExpr',
        name: 'concat',
        return: DT.Str,
        isNotBuiltin: false,
        receiver: Var('msg', DT.Str),
        params: [
          {
            type: 'RecordReferenceExpr',
            return: DT.Str,
            property: 'name',
            recordExpr: ThisLiteral(new DT('UserInfo')),
          },
        ],
      }
    ],
  },
  {
    type: 'ConstDeclaration',
    expr1: Var('maxwell', new DT('UserInfo')),
    expr2: {
      type: 'RecordLiteral',
      properties: [
        { name: 'name', type: DT.Str, value: StringLiteral('Maxwell') },
        { name: 'age', type: DT.Num, value: NumberLiteral(18) },
        { name: 'hasPet', type: DT.Bool, value: BooleanLiteral(false) }
      ],
      return: new DT('UserInfo')
    },
    return: DT.Void,
  },
  {
    type: 'MethodInvokeExpr',
    name: 'UserInfo_isAdult',
    isNotBuiltin: true,
    receiver: Var('maxwell', new DT('UserInfo')),
    params: [],
    return: DT.Bool,
  },
  {
    type: 'MethodInvokeExpr',
    name: 'UserInfo_greetWith',
    isNotBuiltin: true,
    receiver: Var('maxwell', new DT('UserInfo')),
    params: [
      StringLiteral('Hello! '),
    ],
    return: DT.Str,
  },
  {
    type: 'MethodInvokeExpr',
    name: 'UserInfo_isAdult',
    isNotBuiltin: true,
    receiver: Var('maxwell', new DT('UserInfo')),
    params: [],
    return: DT.Bool,
  },
  {
    type: 'MethodInvokeExpr',
    name: 'UserInfo_greetWith',
    isNotBuiltin: true,
    receiver: Var('maxwell', new DT('UserInfo')),
    params: [
      StringLiteral('Hello! '),
    ],
    return: DT.Str,
  },
];

const compiled = `\
function UserInfo_isAdult(_this) {
  return _this.age > 20;
}

function UserInfo_greetWith(_this, msg) {
  return msg.concat(_this.name);
}

const maxwell = { name: 'Maxwell', age: 18, hasPet: false };
UserInfo_isAdult(maxwell);
UserInfo_greetWith(maxwell, 'Hello! ');
UserInfo_isAdult(maxwell);
UserInfo_greetWith(maxwell, 'Hello! ');
`;

const minified = 'function UserInfo_isAdult(_this){return _this.age>20;}function UserInfo_greetWith(_this,msg){return msg.concat(_this.name);}const maxwell={name:\'Maxwell\',age:18,hasPet:false};UserInfo_isAdult(maxwell);UserInfo_greetWith(maxwell,\'Hello! \');UserInfo_isAdult(maxwell);UserInfo_greetWith(maxwell,\'Hello! \');';

export {
  tokens,
  ast,
  compiled,
  minified,
};
