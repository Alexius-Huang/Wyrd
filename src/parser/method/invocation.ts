import * as T from '../../types';
import { parseValueMethodInvokeExpr } from './invocation-by-value';
import { parseTypeMethodInvokeExpr } from './invocation-by-type';
import { TokenTracker, Scope } from '../utils';
import { ParserErrorIf } from '../error';

export function parseMethodInvokeExpr(
  tt: TokenTracker,
  parseExpr: (orevExpr?: T.Expr, meta?: any) => T.Expr,
  scope: Scope,
  prevExpr: T.Expr,
): T.Expr {
  tt.next(); // Skip the `dot` token

  ParserErrorIf(tt.isNot('ident'), `Expect method invoke with token of type \`identifier\`, got token of type \`${tt.type}\``);

  if (prevExpr.type === 'TypeLiteral')
    return parseTypeMethodInvokeExpr(tt, parseExpr, scope, prevExpr);

  return parseValueMethodInvokeExpr(tt, parseExpr, scope, prevExpr);
}
