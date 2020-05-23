import * as T from '../types';
import { TokenTracker, Scope, DataType as DT } from './utils';
import { parseFunctionInvokeExpr } from './function-invocation';
import { ParserErrorIf, ParserError } from './error';
import { parseAssignmentExpr } from './assignment';
import { parseRecordLiteral, parseRecordReferenceExpr } from './record';

export function parseIdentifier(
  tt: TokenTracker,
  parseExpr: (prevExpr?: T.Expr, meta?: any) => T.Expr,
  scope: Scope,
  prevExpr?: T.Expr,
): T.Expr {
  const tokenName = tt.value;
  let result: T.Expr = {
    type: 'IdentLiteral',
    value: tokenName,
    return: DT.Invalid,
  };

  if (scope.hasVariable(tokenName)) {
    result.return = scope.getVariable(tokenName).type;

    if (tt.peekIs('ref')) {
      tt.next();
      result = parseRecordReferenceExpr(tt, parseExpr, scope, result);
    }
  } else if (scope.hasFunction(tokenName)) {
    result = parseFunctionInvokeExpr(tt, parseExpr, scope, prevExpr);
  } else if (scope.hasRecord(tokenName)) {
    result = parseRecordLiteral(tt, parseExpr, scope, prevExpr);
  }

  if (prevExpr?.type === 'BinaryOpExpr') {
    ParserErrorIf(
      DT.isInvalid(result.return),
      `Using the unidentified token \`${tokenName}\``
    );
    prevExpr.expr2 = result;
    const operator = prevExpr.operator;
    const opLeft = prevExpr.expr1.return;
    const opRight = result.return;
    const operatorObj = scope.getOperatorPattern(operator, opLeft, opRight);

    if (operatorObj === undefined)
      ParserError(`Invalid operation for operator \`${prevExpr.operator}\` with operands of type \`${opLeft}\` and \`${opRight}\``);

    prevExpr.return = operatorObj.returnDataType;
    return prevExpr;
  }

  if (prevExpr?.type === 'PrioritizedExpr') {
    prevExpr.expr = result;
    prevExpr.return = result.return;
  }

  if (result.type === 'IdentLiteral' && result.return.isEqualTo(DT.Invalid)) {
    tt.next(); // Skip the current identifier

    /* Handle Assignment Expression when identifier is unknown */
    if (tt.is('eq'))
      return parseAssignmentExpr(tt, parseExpr, scope, result);

    ParserError(`Using the unidentified token \`${result.value}\``)
  }

  return result;
}
