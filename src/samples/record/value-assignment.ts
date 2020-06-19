import { Token, AST, CompilerOptions } from '../../types';
import { Var, BooleanLiteral } from '../helper';
import { DataType as DT, Scope } from '../../parser/utils';

const tokens: Array<Token> = [
  { type: 'ident', value: 'maxwell' },
  { type: 'ref', value: '->' },
  { type: 'ident', value: 'name' },
  { type: 'eq', value: '=' },
  { type: 'ident', value: 'maxwell' },
  { type: 'ref', value: '->' },
  { type: 'ident', value: 'name' },
  { type: 'dot', value: '.' },
  { type: 'ident', value: 'upcase' },
  { type: 'lparen', value: '(' },
  { type: 'rparen', value: ')' },
  { type: 'newline', value: '\n' },

  { type: 'ident', value: 'account' },
  { type: 'ref', value: '->' },
  { type: 'ident', value: 'info' },
  { type: 'ref', value: '->' },
  { type: 'ident', value: 'hasPet' },
  { type: 'eq', value: '=' },
  { type: 'boolean', value: 'True' },
  { type: 'newline', value: '\n' },
];

const ast: AST = [
  {
    type: 'RecordValueAssignmentExpr',
    return: DT.Void,
    expr1: {
      type: 'RecordReferenceExpr',
      recordExpr: Var('maxwell', new DT('UserInfo')),
      property: 'name',
      return: DT.Str,
    },
    expr2: {
      type: 'MethodInvokeExpr',
      name: 'toUpperCase',
      isNotBuiltin: false,
      receiver: {
        type: 'RecordReferenceExpr',
        recordExpr: Var('maxwell', new DT('UserInfo')),
        property: 'name',
        return: DT.Str,
      },
      params: [],
      return: DT.Str,
    },
  },
  {
    type: 'RecordValueAssignmentExpr',
    return: DT.Void,
    expr1: {
      type: 'RecordReferenceExpr',
      recordExpr: {
        type: 'RecordReferenceExpr',
        recordExpr: Var('account', new DT('UserAccount')),
        property: 'info',
        return: new DT('UserInfo'),
      },
      property: 'hasPet',
      return: DT.Bool,
    },
    expr2: BooleanLiteral(true),
  }
];

const compiled = `\
maxwell.name = (maxwell.name).toUpperCase();
account.info.hasPet = true;
`;

const minified = '';

const scope = (s: Scope): Scope => {
  s.createRecord('UserInfo')
    .setProperty(DT.Str, 'name')
    .setProperty(DT.Num, 'age')
    .setProperty(DT.Bool, 'hasPet');
  s.createRecord('UserAccount')
    .setProperty(DT.Str, 'email')
    .setProperty(DT.Str, 'password')
    .setProperty(new DT('UserInfo'), 'info')

  s.createConstant('maxwell', new DT('UserInfo'));
  s.createConstant('account', new DT('UserAccount'));
  return s;
}

const compilerOptions: CompilerOptions = { scopeMiddleware: scope };

export {
  tokens,
  ast,
  compiled,
  compilerOptions,
  minified,
};
