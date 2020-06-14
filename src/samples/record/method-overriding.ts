import { Token, AST, Operator as Op, CompilerOptions } from '../../types';
import { NumberLiteral, StringLiteral, BooleanLiteral, Var, ThisLiteral } from '../helper';
import { DataType as DT, Scope } from '../../parser/utils';

const tokens: Array<Token> = [
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

  { type: 'ident', value: 'maxwell' },
  { type: 'dot', value: '.' },
  { type: 'ident', value: 'isAdult' },
  { type: 'lparen', value: '(' },
  { type: 'rparen', value: ')' },
  { type: 'newline', value: '\n' },
  { type: 'ident', value: 'UserInfo' },
  { type: 'dot', value: '.' },
  { type: 'ident', value: 'isAdult' },
  { type: 'lparen', value: '(' },
  { type: 'ident', value: 'maxwell' },
  { type: 'rparen', value: ')' },
  { type: 'newline', value: '\n' },
  { type: 'newline', value: '\n' },

  { type: 'keyword', value: 'override' },
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
  { type: 'gteq', value: '>=' },
  { type: 'number', value: '18' },
  { type: 'newline', value: '\n' },

  { type: 'ident', value: 'maxwell' },
  { type: 'dot', value: '.' },
  { type: 'ident', value: 'isAdult' },
  { type: 'lparen', value: '(' },
  { type: 'rparen', value: ')' },
  { type: 'newline', value: '\n' },
  { type: 'ident', value: 'UserInfo' },
  { type: 'dot', value: '.' },
  { type: 'ident', value: 'isAdult' },
  { type: 'lparen', value: '(' },
  { type: 'ident', value: 'maxwell' },
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
    type: 'MethodInvokeExpr',
    name: 'UserInfo_isAdult',
    isNotBuiltin: true,
    receiver: Var('maxwell', new DT('UserInfo')),
    params: [],
    return: DT.Bool,
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
    type: 'MethodDeclaration',
    return: DT.Void,
    name: 'UserInfo_isAdult$1',
    receiverType: new DT('UserInfo'),
    outputType: DT.Bool,
    arguments: [],
    body: [
      {
        type: 'BinaryOpExpr',
        return: DT.Bool,
        operator: Op.GtEq,
        expr1: {
          type: 'RecordReferenceExpr',
          return: DT.Num,
          property: 'age',
          recordExpr: ThisLiteral(new DT('UserInfo')),
        },
        expr2: NumberLiteral(18),
      },
    ],
  },
  {
    type: 'MethodInvokeExpr',
    name: 'UserInfo_isAdult$1',
    isNotBuiltin: true,
    receiver: Var('maxwell', new DT('UserInfo')),
    params: [],
    return: DT.Bool,
  },
  {
    type: 'MethodInvokeExpr',
    name: 'UserInfo_isAdult$1',
    isNotBuiltin: true,
    receiver: Var('maxwell', new DT('UserInfo')),
    params: [],
    return: DT.Bool,
  },
];

const compiled = `\
function UserInfo_isAdult(_this) {
  return _this.age > 20;
}

UserInfo_isAdult(maxwell);
UserInfo_isAdult(maxwell);
function UserInfo_isAdult$1(_this) {
  return _this.age >= 18;
}

UserInfo_isAdult$1(maxwell);
UserInfo_isAdult$1(maxwell);
`;

const minified = 'function UserInfo_isAdult(_this){return _this.age>20;}UserInfo_isAdult(maxwell);UserInfo_isAdult(maxwell);function UserInfo_isAdult$1(_this){return _this.age>=18;}UserInfo_isAdult$1(maxwell);UserInfo_isAdult$1(maxwell);';

const scope = (s: Scope): Scope => {
  const userInfo = s.createRecord('UserInfo');
  userInfo
    .setProperty(DT.Str, 'name')
    .setProperty(DT.Num, 'age')
    .setProperty(DT.Bool, 'hasPet');

  s.createConstant('maxwell', new DT('UserInfo'));
  return s;
};

const compilerOptions: CompilerOptions = { scopeMiddleware: scope };

export {
  tokens,
  ast,
  compiled,
  minified,
  compilerOptions
};
