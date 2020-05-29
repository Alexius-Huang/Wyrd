import { Token, AST, ParseOptions } from '../../types';
import { Var } from '../helper';
import { DataType as DT, Scope } from '../../parser/utils';

const program = `\
age = maxwell->age
mutable name = maxwell->name
name = maxwell->name
`;

const tokens: Array<Token> = [
  { type: 'ident', value: 'age' },
  { type: 'eq', value: '=' },
  { type: 'ident', value: 'maxwell' },
  { type: 'ref', value: '->' },
  { type: 'ident', value: 'age' },
  { type: 'newline', value: '\n' },

  { type: 'keyword', value: 'mutable' },
  { type: 'ident', value: 'name' },
  { type: 'eq', value: '=' },
  { type: 'ident', value: 'maxwell' },
  { type: 'ref', value: '->' },
  { type: 'ident', value: 'name' },
  { type: 'newline', value: '\n' },

  { type: 'ident', value: 'name' },
  { type: 'eq', value: '=' },
  { type: 'ident', value: 'maxwell' },
  { type: 'ref', value: '->' },
  { type: 'ident', value: 'name' },
  { type: 'newline', value: '\n' },
];

const ast: AST = [
  {
    type: 'AssignmentExpr',
    return: DT.Void,
    expr1: Var('age', DT.Num),
    expr2: {
      type: 'RecordReferenceExpr',
      recordExpr: Var('maxwell', new DT('UserInfo')),
      property: 'age',
      return: DT.Num
    },
  },
  {
    type: 'VarDeclaration',
    return: DT.Void,
    expr1: Var('name', DT.Str),
    expr2: {
      type: 'RecordReferenceExpr',
      recordExpr: Var('maxwell', new DT('UserInfo')),
      property: 'name',
      return: DT.Str
    },
  },
  {
    type: 'VarAssignmentExpr',
    return: DT.Void,
    expr1: Var('name', DT.Str),
    expr2: {
      type: 'RecordReferenceExpr',
      recordExpr: Var('maxwell', new DT('UserInfo')),
      property: 'name',
      return: DT.Str
    },
  },
];

const compiled = `\
const age = maxwell.age;
let name = maxwell.name;
name = maxwell.name;
`;

const minified = 'const age=maxwell.age;let name=maxwell.name;name=maxwell.name;';

const scope = (s: Scope): Scope => {
  const record = s.createRecord('UserInfo');
  record
    .setProperty(DT.Str, 'name')
    .setProperty(DT.Num, 'age')
    .setProperty(DT.Bool, 'hasPet');

  s.createConstant('maxwell', new DT('UserInfo'));
  return s;
}

const parseOptions: ParseOptions = { scope };

export {
  program,
  tokens,
  ast,
  compiled,
  parseOptions,
  minified,
};
