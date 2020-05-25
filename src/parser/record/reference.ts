import * as T from '../../types';
import { TokenTracker, Scope } from '../utils';
import { ParserError } from '../error';

export function parseRecordReferenceExpr(
  tt: TokenTracker,
  parseExpr: T.ExpressionParsingFunction,
  scope: Scope,
  prevExpr: T.Expr
): T.Expr {
  tt.next(); // Skip `->`

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
