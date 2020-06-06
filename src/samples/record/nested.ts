import { Token, AST } from '../../types';
import { NumberLiteral, StringLiteral, BooleanLiteral, Var } from '../helper';
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

  { type: 'keyword', value: 'record' },
  { type: 'ident', value: 'UserAccount' },
  { type: 'lcurly', value: '{' },
  { type: 'newline', value: '\n' },
  { type: 'builtin-type', value: 'Str' },
  { type: 'ident', value: 'email' },
  { type: 'comma', value: ',' },
  { type: 'newline', value: '\n' },
  { type: 'builtin-type', value: 'Str' },
  { type: 'ident', value: 'password' },
  { type: 'comma', value: ',' },
  { type: 'newline', value: '\n' },
  { type: 'ident', value: 'UserInfo' },
  { type: 'ident', value: 'info' },
  { type: 'newline', value: '\n' },
  { type: 'rcurly', value: '}' },
  { type: 'newline', value: '\n' },
  { type: 'newline', value: '\n' },

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

  { type: 'ident', value: 'user1' },
  { type: 'eq', value: '=' },
  { type: 'ident', value: 'UserAccount' },
  { type: 'lcurly', value: '{' },
  { type: 'newline', value: '\n' },
  { type: 'ident', value: 'email' },
  { type: 'colon', value: ':' },
  { type: 'string', value: 'example@email.com' },
  { type: 'comma', value: ',' },
  { type: 'newline', value: '\n' },
  { type: 'ident', value: 'password' },
  { type: 'colon', value: ':' },
  { type: 'string', value: 'HA$H3D' },
  { type: 'comma', value: ',' },
  { type: 'newline', value: '\n' },
  { type: 'ident', value: 'info' },
  { type: 'colon', value: ':' },
  { type: 'ident', value: 'maxwell' },
  { type: 'newline', value: '\n' },
  { type: 'rcurly', value: '}' },
  { type: 'newline', value: '\n' },
  { type: 'newline', value: '\n' },

  { type: 'ident', value: 'user2' },
  { type: 'eq', value: '=' },
  { type: 'ident', value: 'UserAccount' },
  { type: 'lcurly', value: '{' },
  { type: 'newline', value: '\n' },
  { type: 'ident', value: 'email' },
  { type: 'colon', value: ':' },
  { type: 'string', value: 'example@email.com' },
  { type: 'comma', value: ',' },
  { type: 'newline', value: '\n' },
  { type: 'ident', value: 'password' },
  { type: 'colon', value: ':' },
  { type: 'string', value: 'HA$H3D' },
  { type: 'comma', value: ',' },
  { type: 'newline', value: '\n' },
  { type: 'ident', value: 'info' },
  { type: 'colon', value: ':' },
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
  { type: 'rcurly', value: '}' },
  { type: 'newline', value: '\n' },
  { type: 'newline', value: '\n' },

  { type: 'ident', value: 'info' },
  { type: 'eq', value: '=' },
  { type: 'ident', value: 'user1' },
  { type: 'ref', value: '->' },
  { type: 'ident', value: 'info' },
  { type: 'newline', value: '\n' },

  { type: 'ident', value: 'age' },
  { type: 'eq', value: '=' },
  { type: 'ident', value: 'info' },
  { type: 'ref', value: '->' },
  { type: 'ident', value: 'age' },
  { type: 'newline', value: '\n' },

  { type: 'ident', value: 'name' },
  { type: 'eq', value: '=' },
  { type: 'ident', value: 'user1' },
  { type: 'ref', value: '->' },
  { type: 'ident', value: 'info' },
  { type: 'ref', value: '->' },
  { type: 'ident', value: 'name' },
  { type: 'newline', value: '\n' }
];

const ast: AST = [
  {
    type: 'AssignmentExpr',
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
    type: 'AssignmentExpr',
    expr1: Var('user1', new DT('UserAccount')),
    expr2: {
      type: 'RecordLiteral',
      properties: [
        { name: 'email', type: DT.Str, value: StringLiteral('example@email.com') },
        { name: 'password', type: DT.Str, value: StringLiteral('HA$H3D') },
        { name: 'info', type: new DT('UserInfo'), value: Var('maxwell', new DT('UserInfo')) },
      ],
      return: new DT('UserAccount')
    },
    return: DT.Void,
  },
  {
    type: 'AssignmentExpr',
    expr1: Var('user2', new DT('UserAccount')),
    expr2: {
      type: 'RecordLiteral',
      properties: [
        { name: 'email', type: DT.Str, value: StringLiteral('example@email.com') },
        { name: 'password', type: DT.Str, value: StringLiteral('HA$H3D') },
        {
          name: 'info',
          type: new DT('UserInfo'),
          value: {
            type: 'RecordLiteral',
            properties: [
              { name: 'name', type: DT.Str, value: StringLiteral('Maxwell') },
              { name: 'age', type: DT.Num, value: NumberLiteral(18) },
              { name: 'hasPet', type: DT.Bool, value: BooleanLiteral(false) }
            ],
            return: new DT('UserInfo'),
          },
        },
      ],
      return: new DT('UserAccount')
    },
    return: DT.Void,
  },
  {
    type: 'AssignmentExpr',
    expr1: Var('info', new DT('UserInfo')),
    expr2: {
      type: 'RecordReferenceExpr',
      recordExpr: Var('user1', new DT('UserAccount')),
      property: 'info',
      return: new DT('UserInfo'),
    },
    return: DT.Void,
  },
  {
    type: 'AssignmentExpr',
    expr1: Var('age', DT.Num),
    expr2: {
      type: 'RecordReferenceExpr',
      recordExpr: Var('info', new DT('UserInfo')),
      property: 'age',
      return: DT.Num,
    },
    return: DT.Void,
  },
  {
    type: 'AssignmentExpr',
    expr1: Var('name', DT.Str),
    expr2: {
      type: 'RecordReferenceExpr',
      recordExpr: {
        type: 'RecordReferenceExpr',
        recordExpr: Var('user1', new DT('UserAccount')),
        property: 'info',
        return: new DT('UserInfo'),
      },
      property: 'name',
      return: DT.Str,
    },
    return: DT.Void,
  },
];

const compiled = `\
const maxwell = { name: 'Maxwell', age: 18, hasPet: false };
const user1 = { email: 'example@email.com', password: 'HA$H3D', info: maxwell };
const user2 = { email: 'example@email.com', password: 'HA$H3D', info: { name: 'Maxwell', age: 18, hasPet: false } };
const info = user1.info;
const age = info.age;
const name = user1.info.name;
`;

const minified = 'const maxwell={name:\'Maxwell\',age:18,hasPet:false};const user1={email:\'example@email.com\',password:\'HA$H3D\',info:maxwell};const user2={email:\'example@email.com\',password:\'HA$H3D\',info:{name:\'Maxwell\',age:18,hasPet:false}};const info=user1.info;const age=info.age;const name=user1.info.name;';

export {
  tokens,
  ast,
  compiled,
  minified,
};
