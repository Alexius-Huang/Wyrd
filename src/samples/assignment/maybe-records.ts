import { Token, AST } from '../../types';
import { NumberLiteral, BooleanLiteral, Var, NullLiteral, StringLiteral } from '../helper';
import { DataType as DT } from '../../parser/utils';

const tokens: Array<Token> = [
  { type: 'keyword', value: 'record' },
  { type: 'ident', value: 'UserInfo' },
  { type: 'lcurly', value: '{' },
  { type: 'builtin-type', value: 'Str' },
  { type: 'ident', value: 'name' },
  { type: 'comma', value: ',' },
  { type: 'builtin-type', value: 'Num' },
  { type: 'ident', value: 'age' },
  { type: 'comma', value: ',' },
  { type: 'builtin-type', value: 'Bool' },
  { type: 'ident', value: 'hasPet' },
  { type: 'rcurly', value: '}' },
  { type: 'newline', value: '\n' },

  { type: 'keyword', value: 'mutable' },
  { type: 'ident', value: 'baz' },
  { type: 'keyword', value: 'maybe' },
  { type: 'ident', value: 'UserInfo' },
  { type: 'eq', value: '=' },
  { type: 'ident', value: 'UserInfo' },
  { type: 'lcurly', value: '{' },
  { type: 'ident', value: 'name' },
  { type: 'colon', value: ':' },
  { type: 'string', value: 'Maxwell' },
  { type: 'comma', value: ',' },
  { type: 'ident', value: 'age' },
  { type: 'colon', value: ':' },
  { type: 'number', value: '18' },
  { type: 'comma', value: ',' },
  { type: 'ident', value: 'hasPet' },
  { type: 'colon', value: ':' },
  { type: 'boolean', value: 'False' },
  { type: 'rcurly', value: '}' },
  { type: 'newline', value: '\n' },

  { type: 'ident', value: 'baz' },
  { type: 'eq', value: '=' },
  { type: 'null', value: 'Null' },
  { type: 'newline', value: '\n' },

  { type: 'ident', value: 'baz' },
  { type: 'eq', value: '=' },
  { type: 'ident', value: 'UserInfo' },
  { type: 'lcurly', value: '{' },
  { type: 'ident', value: 'name' },
  { type: 'colon', value: ':' },
  { type: 'string', value: 'Alexius' },
  { type: 'comma', value: ',' },
  { type: 'ident', value: 'age' },
  { type: 'colon', value: ':' },
  { type: 'number', value: '20' },
  { type: 'comma', value: ',' },
  { type: 'ident', value: 'hasPet' },
  { type: 'colon', value: ':' },
  { type: 'boolean', value: 'True' },
  { type: 'rcurly', value: '}' },
  { type: 'newline', value: '\n' },
  { type: 'newline', value: '\n' },

  { type: 'keyword', value: 'mutable' },
  { type: 'ident', value: 'bazz' },
  { type: 'keyword', value: 'maybe' },
  { type: 'ident', value: 'UserInfo' },
  { type: 'newline', value: '\n' },

  { type: 'ident', value: 'bazz' },
  { type: 'eq', value: '=' },
  { type: 'ident', value: 'UserInfo' },
  { type: 'lcurly', value: '{' },
  { type: 'ident', value: 'age' },
  { type: 'colon', value: ':' },
  { type: 'number', value: '23' },
  { type: 'comma', value: ',' },
  { type: 'ident', value: 'hasPet' },
  { type: 'colon', value: ':' },
  { type: 'boolean', value: 'False' },
  { type: 'comma', value: ',' },
  { type: 'ident', value: 'name' },
  { type: 'colon', value: ':' },
  { type: 'string', value: 'Martin' },
  { type: 'rcurly', value: '}' },
  { type: 'newline', value: '\n' },

  { type: 'ident', value: 'bazz' },
  { type: 'eq', value: '=' },
  { type: 'null', value: 'Null' },
  { type: 'newline', value: '\n' },
];

const ast: AST = [
  {
    type: 'VarDeclaration',
    expr1: Var('baz', new DT('UserInfo', true)),
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
    type: 'VarAssignmentExpr',
    expr1: Var('baz', new DT('UserInfo', true)),
    expr2: NullLiteral(),
    return: DT.Void,
  },
  {
    type: 'VarAssignmentExpr',
    expr1: Var('baz', new DT('UserInfo', true)),
    expr2: {
      type: 'RecordLiteral',
      properties: [
        { name: 'name', type: DT.Str, value: StringLiteral('Alexius') },
        { name: 'age', type: DT.Num, value: NumberLiteral(20) },
        { name: 'hasPet', type: DT.Bool, value: BooleanLiteral(true) }
      ],
      return: new DT('UserInfo')
    },
    return: DT.Void,
  },
  {
    type: 'VarDeclaration',
    expr1: Var('bazz', new DT('UserInfo', true)),
    expr2: NullLiteral(),
    return: DT.Void,
  },
  {
    type: 'VarAssignmentExpr',
    expr1: Var('bazz', new DT('UserInfo', true)),
    expr2: {
      type: 'RecordLiteral',
      properties: [
        { name: 'age', type: DT.Num, value: NumberLiteral(23) },
        { name: 'hasPet', type: DT.Bool, value: BooleanLiteral(false) },
        { name: 'name', type: DT.Str, value: StringLiteral('Martin') },
      ],
      return: new DT('UserInfo')
    },
    return: DT.Void,
  },
  {
    type: 'VarAssignmentExpr',
    expr1: Var('bazz', new DT('UserInfo', true)),
    expr2: NullLiteral(),
    return: DT.Void,
  },
];

const compiled = `\
let baz = { name: 'Maxwell', age: 18, hasPet: false };
baz = null;
baz = { name: 'Alexius', age: 20, hasPet: true };
let bazz = null;
bazz = { age: 23, hasPet: false, name: 'Martin' };
bazz = null;
`;

const minified = 'let baz={name:\'Maxwell\',age:18,hasPet:false};baz=null;baz={name:\'Alexius\',age:20,hasPet:true};let bazz=null;bazz={age:23,hasPet:false,name:\'Martin\'};bazz=null;';

export {
  tokens,
  ast,
  compiled,
  minified,
};
