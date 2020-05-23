import * as T from '../types';
import { TokenTracker, Scope } from './utils';
import { ParserError } from './error';

export function parseRecordReferenceExpr(
  tt: TokenTracker,
  parseExpr: (prevExpr?: T.Expr, meta?: any) => T.Expr,
  scope: Scope,
  prevExpr: T.Expr
): T.Expr {
  tt.next(); // Skip `->`

  if (prevExpr.type === 'AssignmentExpr' || prevExpr.type === 'VarDeclaration')
    return handleGeneralVarDeclarationExpr(tt, parseExpr, scope, prevExpr);

  /* Check if the prevExpr returns record */
  const prevExprType = prevExpr.return.type;
  if (!scope.hasRecord(prevExprType))
    ParserError(`Type \`${prevExpr.return}\` is not a kind of record`);

  /* Check if next token is of type `ident` and is property of record */
  if (tt.isNot('ident'))
    ParserError(`Expect next token to be \`ident\` when referening property of a record, instead got token of type \`${tt.type}\``);

  const propName = tt.value;
  const record = scope.getRecord(prevExprType);
  if (!record.hasProperty(propName))
    ParserError(`Property \`${propName}\` isn't declared in record \`${record.name}\``);

  const recordProp = record.getProperty(propName);
  return {
    type: 'RecordReferenceExpr',
    recordExpr: prevExpr,
    property: recordProp.name,
    return: recordProp.type,
  } as T.RecordReferenceExpr;
}

function handleGeneralVarDeclarationExpr(
  tt: TokenTracker,
  parseExpr: (prevExpr?: T.Expr, meta?: any) => T.Expr,
  scope: Scope,
  prevExpr: T.AssignmentExpr | T.VarDeclaration
): T.AssignmentExpr | T.VarDeclaration {
  const prevExprType = prevExpr.expr2.return.type;
  if (!scope.hasRecord(prevExprType))
    ParserError(`Type \`${prevExpr.return}\` is not a kind of record`);

  /* Check if next token is of type `ident` and is property of record */
  if (tt.isNot('ident'))
    ParserError(`Expect next token to be \`ident\` when referening property of a record, instead got token of type \`${tt.type}\``);

  const propName = tt.value;
  const record = scope.getRecord(prevExprType);
  if (!record.hasProperty(propName))
    ParserError(`Property \`${propName}\` isn't declared in record \`${record.name}\``);

  const recordProp = record.getProperty(propName);
  prevExpr.expr2 = {
    type: 'RecordReferenceExpr',
    recordExpr: prevExpr.expr2,
    property: recordProp.name,
    return: recordProp.type,
  } as T.RecordReferenceExpr;

  /* Type Correction for assignment */
  prevExpr.expr1.return = recordProp.type;
  const varInfo = scope.getVariable(prevExpr.expr1.value);
  varInfo.type = recordProp.type;

  return prevExpr;
}
