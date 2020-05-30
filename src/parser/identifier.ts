import * as T from '../types';
import { TokenTracker, Scope, DataType as DT } from './utils';
import { parseFunctionInvokeExpr } from './function-invocation';
import { ParserErrorIf, ParserError } from './error';
import { parseAssignmentExpr } from './assignment';
import { parseRecordLiteral, parseRecordReferenceExpr } from './record';
import { parseMethodInvokeExpr } from './method/invocation';
import { parseTypeLiteral } from './type-literal';

export function parseIdentifier(
  tt: TokenTracker,
  parseExpr: T.ExpressionParsingFunction,
  scope: Scope,
  prevExpr?: T.Expr,
): T.Expr {
  const tokenName = tt.value;
  let result: T.Expr = {
    type: 'IdentLiteral',
    value: tokenName,
    return: DT.Invalid,
  };

  /* Handle Identifier as a Variable */
  if (scope.hasVariable(tokenName)) {
    result.return = scope.getVariable(tokenName).type;

    while (tt.peekIs('dot') || tt.peekIs('ref')) {
      tt.next();
      if (tt.is('dot')) {
        result = parseMethodInvokeExpr(tt, parseExpr, scope, result);
      } else {
        result = parseRecordReferenceExpr(tt, parseExpr, scope, result);
      }
    }
  }

  /* Handle Identifier as a Function*/
  else if (scope.hasFunction(tokenName)) {
    if (!tt.peekIs('lparen'))
      ParserError(`Unhandled function \`${tokenName}\` as a value, currently Wyrd-Lang do not support function object`);

    result = parseFunctionInvokeExpr(tt, parseExpr, scope, prevExpr);
    while (tt.peekIs('dot') || tt.peekIs('ref')) {
      tt.next();
      if (tt.is('dot')) {
        result = parseMethodInvokeExpr(tt, parseExpr, scope, result);
      } else {
        result = parseRecordReferenceExpr(tt, parseExpr, scope, result);
      }
    }
  }

  /* Handle Identifier as a Record */
  else if (scope.hasRecord(tokenName)) {
    result = parseRecordLiteral(tt, parseExpr, scope, prevExpr);
  }

  else if (scope.hasGenericType(tokenName)) {
    return parseTypeLiteral(tt, parseExpr, scope);
  }

  else if (scope.hasGenericPlaceholder(tokenName)) {
    result.return = DT.Void;
    return result;
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
