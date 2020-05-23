import * as T from '../../types';
import { TokenTracker, Scope } from '../utils';
import { parseNumberLiteral } from './number';
import { parseStringLiteral } from './string';
import { parseBooleanLiteral } from './boolean';
import { parseNullLiteral } from './null';
import { parseMethodInvokeExpr } from '../method-invocation';

const primitiveMapParsingFunctions = new Map([
  ['number', parseNumberLiteral],
  ['string', parseStringLiteral],
  ['boolean', parseBooleanLiteral],
  ['null', parseNullLiteral],
]);

export function parsePrimitive(
  tt: TokenTracker,
  parseExpr: (prevExpr?: T.Expr, meta?: any) => T.Expr,
  scope: Scope,
  prevExpr?: T.Expr,
): T.Expr {
  const func = primitiveMapParsingFunctions.get(tt.type) as
    (tt: TokenTracker, scope: Scope, prevExpr?: T.Expr) => T.Expr;
  let result = func(tt, scope, prevExpr);

  /* Parse wuth method invocation if value chained directly with dot token */
  while (true) {
    if (tt.peekIs('dot')) {
      tt.next();
      result = parseMethodInvokeExpr(tt, parseExpr, scope, result);
      continue;
    }
    break;  
  }

  return result;
}
