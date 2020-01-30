import * as T from '../types';
import { ParserError } from './error';
import { getOPActionDetail } from './helper';
import TokenTracker from './TokenTracker';
import { EmptyExpression } from './constants';

export function parsePrioritizedExpr(
  tt: TokenTracker,
  parseExpr: (prevExpr?: T.Expr, meta?: any) => T.Expr,
  scope: T.Scope,
  prevExpr?: T.Expr,
): T.Expr {
  tt.next(); // Skip the lparen token
  let result: T.PrioritizedExpr = {
    type: 'PrioritizedExpr',
    expr: EmptyExpression,
    returnType: 'Invalid',
  };

  while (tt.isNotOneOf('rparen', 'comma')) {
    result.expr = parseExpr(result, { scope });
    if (result.expr.type === 'FunctionInvokeExpr' && tt.is('rparen')) break;
    tt.next();
  }

  if (prevExpr !== undefined) {
    if (prevExpr.type === 'BinaryOpExpr') {
      if (result.expr.type !== 'FunctionInvokeExpr') {
        prevExpr.expr2 = result;
      } else {
        prevExpr.expr2 = result.expr;
      }

      const opAction = getOPActionDetail(
        prevExpr.operator,
        prevExpr.expr2.returnType,
        result.returnType
      );

      prevExpr.returnType = opAction.returnType;
      return prevExpr;
    }

    if (prevExpr.type === 'NotExpr') {
      if (result.expr.type !== 'FunctionInvokeExpr') {
        prevExpr.expr = result;
      } else {
        prevExpr.expr = result.expr;
      }

      return result;
    }

    ParserError(`Unhandled parsing prioritized expression based on expression of type \`${prevExpr.type}\``);
  }

  if (result.expr.type === 'FunctionInvokeExpr')
    return result.expr;

  result.returnType = result.expr.returnType;
  return result;
}
