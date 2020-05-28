import * as T from '../../types';
import { TokenTracker, Scope } from '../utils';
import { parseNumberLiteral } from './number';
import { parseStringLiteral } from './string';
import { parseBooleanLiteral } from './boolean';
import { parseNullLiteral } from './null';
import { parseMethodInvokeExpr } from '../method/invocation';
import { ParserError } from '../error';

const primitiveMapParsingFunctions = new Map([
  ['number', parseNumberLiteral],
  ['string', parseStringLiteral],
  ['boolean', parseBooleanLiteral],
  ['null', parseNullLiteral],
]);

export function parsePrimitive(
  tt: TokenTracker,
  parseExpr: T.ExpressionParsingFunction,
  scope: Scope,
  prevExpr?: T.Expr,
): T.Expr {
  const func = primitiveMapParsingFunctions.get(tt.type) as
    (tt: TokenTracker, scope: Scope, prevExpr?: T.Expr) => T.Expr;
  let result = func(tt, scope, prevExpr);

  /* Parse wuth method invocation if value chained directly with dot token */
  while (tt.peekIs('dot')) {
    tt.next();
    result = parseMethodInvokeExpr(tt, parseExpr, scope, result);
  }

  // TODO: After implement operator overloading, should also test
  //       operator mixed method invocation
  if (prevExpr?.type === 'BinaryOpExpr') {
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

  return result;
}
