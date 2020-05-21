import { Expr } from '../../types';
import { TokenTracker, Scope } from '../utils';
import { parseNumberLiteral } from './number';
import { parseStringLiteral } from './string';
import { parseBooleanLiteral } from './boolean';
import { parseNullLiteral } from './null';

const primitiveMapParsingFunctions = new Map([
  ['number', parseNumberLiteral],
  ['string', parseStringLiteral],
  ['boolean', parseBooleanLiteral],
  ['null', parseNullLiteral],
]);

export function parsePrimitive(
  tt: TokenTracker,
  scope: Scope,
  prevExpr?: Expr,
) {
  const func = primitiveMapParsingFunctions.get(tt.type) as
    (tt: TokenTracker, scope: Scope, prevExpr?: Expr) => Expr;
  return func(tt, scope, prevExpr);
}
