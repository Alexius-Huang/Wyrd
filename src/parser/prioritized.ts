import * as T from '../types';
import { ParserError } from './error';
import { getOPActionDetail } from './helper';
import TokenTracker from './TokenTracker';

export function parsePrioritizedExpr(
  tt: TokenTracker,
  parseExpr: (prevExpr?: T.Expr, meta?: any) => T.Expr,
  scope: T.Scope,
  prevExpr?: T.Expr,
): T.Expr {
  tt.next(); // Skip the lparen token
  let result: T.PrioritizedExpr = { type: 'PrioritizedExpr' };

  while (true) {
    result.expr = parseExpr(result, { scope });
    tt.next();
    if (tt.is('rparen')) break;
  }

  if (prevExpr !== undefined) {
    if (prevExpr.type === 'BinaryOpExpr') {
      prevExpr.expr2 = result;
      const opAction = getOPActionDetail(
        prevExpr.operator,
        prevExpr.expr2.returnType as string,
        result.returnType as string
      );

      prevExpr.returnType = opAction.returnType;
      return prevExpr;
    }

    if (prevExpr.type === 'NotExpr') {
      prevExpr.expr = result;
      return result;
    }

    ParserError(`Unhandled parsing prioritized expression based on expression of type \`${prevExpr.type}\``);
  }

  // TODO: Remove this if every expression support returnType
  result.returnType = (result.expr as T.BinaryOpExpr).returnType;
  return result;
}
