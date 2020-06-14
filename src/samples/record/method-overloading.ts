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

  { type: 'keyword', value: 'def' },
  { type: 'ident', value: 'UserInfo' },
  { type: 'dot', value: '.' },
  { type: 'ident', value: 'isAdult' },
  { type: 'lparen', value: '(' },
  { type: 'ident', value: 'threshold' },
  { type: 'colon', value: ':' },
  { type: 'builtin-type', value: 'Num' },
  { type: 'rparen', value: ')' },
  { type: 'colon', value: ':' },
  { type: 'builtin-type', value: 'Bool' },
  { type: 'arrow', value: '=>' },
  { type: 'keyword', value: 'this' },
  { type: 'ref', value: '->' },
  { type: 'ident', value: 'age' },
  { type: 'gteq', value: '>=' },
  { type: 'ident', value: 'threshold' },
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
  { type: 'ident', value: 'isAdult' },
  { type: 'lparen', value: '(' },
  { type: 'number', value: '18' },
  { type: 'rparen', value: ')' },
  { type: 'newline', value: '\n' },

  { type: 'ident', value: 'UserInfo' },
  { type: 'dot', value: '.' },
  { type: 'ident', value: 'isAdult' },
  { type: 'lparen', value: '(' },
  { type: 'ident', value: 'maxwell' },
  { type: 'comma', value: ',' },
  { type: 'number', value: '18' },
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
    type: 'MethodDeclaration',
    return: DT.Void,
    name: 'UserInfo_isAdult_1',
    receiverType: new DT('UserInfo'),
    outputType: DT.Bool,
    arguments: [
      { ident: 'threshold', type: DT.Num },
    ],
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
        expr2: Var('threshold', DT.Num),
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
    name: 'UserInfo_isAdult_1',
    isNotBuiltin: true,
    receiver: Var('maxwell', new DT('UserInfo')),
    params: [
      NumberLiteral(18),
    ],
    return: DT.Bool,
  },
  {
    type: 'MethodInvokeExpr',
    name: 'UserInfo_isAdult_1',
    isNotBuiltin: true,
    receiver: Var('maxwell', new DT('UserInfo')),
    params: [
      NumberLiteral(18),
    ],
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
];

const compiled = `\
function UserInfo_isAdult(_this) {
  return _this.age > 20;
}

function UserInfo_isAdult_1(_this, threshold) {
  return _this.age >= threshold;
}

UserInfo_isAdult(maxwell);
UserInfo_isAdult_1(maxwell, 18);
UserInfo_isAdult_1(maxwell, 18);
UserInfo_isAdult(maxwell);
`;

const minified = 'function UserInfo_isAdult(_this){return _this.age>20;}function UserInfo_isAdult_1(_this,threshold){return _this.age>=threshold;}UserInfo_isAdult(maxwell);UserInfo_isAdult_1(maxwell,18);UserInfo_isAdult_1(maxwell,18);UserInfo_isAdult(maxwell);';

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
