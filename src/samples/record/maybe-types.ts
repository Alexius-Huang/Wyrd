import { Token, AST } from '../../types';
import { NumberLiteral, StringLiteral, BooleanLiteral, Var, NullLiteral } from '../helper';
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
  { type: 'keyword', value: 'maybe' },
  { type: 'builtin-type', value: 'Num' },
  { type: 'ident', value: 'age' },
  { type: 'comma', value: ',' },
  { type: 'newline', value: '\n' },
  { type: 'keyword', value: 'maybe' },
  { type: 'builtin-type', value: 'Bool' },
  { type: 'ident', value: 'hasPet' },
  { type: 'newline', value: '\n' },
  { type: 'rcurly', value: '}' },
  { type: 'newline', value: '\n' },
  { type: 'newline', value: '\n' },

  { type: 'ident', value: 'UserInfo' },
  { type: 'ident', value: 'maxwell' },
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

  { type: 'ident', value: 'UserInfo' },
  { type: 'ident', value: 'alice' },
  { type: 'eq', value: '=' },
  { type: 'ident', value: 'UserInfo' },
  { type: 'lcurly', value: '{' },
  { type: 'ident', value: 'name' },
  { type: 'colon', value: ':' },
  { type: 'string', value: 'Alice' },
  { type: 'comma', value: ',' },
  { type: 'ident', value: 'hasPet' },
  { type: 'colon', value: ':' },
  { type: 'boolean', value: 'True' },
  { type: 'rcurly', value: '}' },
  { type: 'newline', value: '\n' },

  { type: 'ident', value: 'UserInfo' },
  { type: 'ident', value: 'telsa' },
  { type: 'eq', value: '=' },
  { type: 'ident', value: 'UserInfo' },
  { type: 'lcurly', value: '{' },
  { type: 'ident', value: 'age' },
  { type: 'colon', value: ':' },
  { type: 'number', value: '88' },
  { type: 'comma', value: ',' },
  { type: 'ident', value: 'name' },
  { type: 'colon', value: ':' },
  { type: 'string', value: 'Telsa' },
  { type: 'rcurly', value: '}' },
  { type: 'newline', value: '\n' },

  { type: 'ident', value: 'UserInfo' },
  { type: 'ident', value: 'irene' },
  { type: 'eq', value: '=' },
  { type: 'ident', value: 'UserInfo' },
  { type: 'lcurly', value: '{' },
  { type: 'ident', value: 'name' },
  { type: 'colon', value: ':' },
  { type: 'string', value: 'Irene' },
  { type: 'rcurly', value: '}' },
  { type: 'newline', value: '\n' },
];

const ast: AST = [
  {
    type: 'ConstDeclaration',
    expr1: Var('maxwell', new DT('UserInfo')),
    expr2: {
      type: 'RecordLiteral',
      properties: [
        { name: 'name', type: DT.Str, value: StringLiteral('Maxwell') },
        { name: 'age', type: DT.Maybe.Num, value: NumberLiteral(18) },
        { name: 'hasPet', type: DT.Maybe.Bool, value: BooleanLiteral(false) }
      ],
      return: new DT('UserInfo')
    },
    return: DT.Void,
  },
  {
    type: 'ConstDeclaration',
    expr1: Var('alice', new DT('UserInfo')),
    expr2: {
      type: 'RecordLiteral',
      properties: [
        { name: 'name', type: DT.Str, value: StringLiteral('Alice') },
        { name: 'hasPet', type: DT.Maybe.Bool, value: BooleanLiteral(true) },
        { name: 'age', type: DT.Maybe.Num, value: NullLiteral() },
      ],
      return: new DT('UserInfo'),
    },
    return: DT.Void,
  },
  {
    type: 'ConstDeclaration',
    expr1: Var('telsa', new DT('UserInfo')),
    expr2: {
      type: 'RecordLiteral',
      properties: [
        { name: 'age', type: DT.Maybe.Num, value: NumberLiteral(88) },
        { name: 'name', type: DT.Str, value: StringLiteral('Telsa') },
        { name: 'hasPet', type: DT.Maybe.Bool, value: NullLiteral() },
      ],
      return: new DT('UserInfo'),
    },
    return: DT.Void,
  },
  {
    type: 'ConstDeclaration',
    expr1: Var('irene', new DT('UserInfo')),
    expr2: {
      type: 'RecordLiteral',
      properties: [
        { name: 'name', type: DT.Str, value: StringLiteral('Irene') },
        { name: 'age', type: DT.Maybe.Num, value: NullLiteral() },
        { name: 'hasPet', type: DT.Maybe.Bool, value: NullLiteral() },
      ],
      return: new DT('UserInfo'),
    },
    return: DT.Void,
  },
];

const compiled = `\
const maxwell = { name: 'Maxwell', age: 18, hasPet: false };
const alice = { name: 'Alice', hasPet: true, age: null };
const telsa = { age: 88, name: 'Telsa', hasPet: null };
const irene = { name: 'Irene', age: null, hasPet: null };
`;

const minified = 'const maxwell={name:\'Maxwell\',age:18,hasPet:false};const alice={name:\'Alice\',hasPet:true,age:null};const telsa={age:88,name:\'Telsa\',hasPet:null};const irene={name:\'Irene\',age:null,hasPet:null};';

export {
  tokens,
  ast,
  compiled,
  minified,
};
