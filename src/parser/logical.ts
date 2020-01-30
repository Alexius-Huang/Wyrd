import * as T from '../types';
import TokenTracker from './TokenTracker';
import { EmptyExpression } from './constants';

export function parseLogicalNotExpr(
  tt: TokenTracker,
  parseExpr: (prevExpr?: T.Expr, meta?: any) => T.Expr,
): T.Expr {
  let result: T.NotExpr = {
    type: 'NotExpr',
    expr: EmptyExpression,
    returnType: 'Bool',
  };
  tt.next();
  result.expr = parseExpr(result);
  return result;
}

export function parseLogicalAndOrExpr(
  tt: TokenTracker,
  parseExpr: (prevExpr?: T.Expr, meta?: any) => T.Expr,
  prevExpr: T.Expr,
): T.Expr {
  const logicType = tt.valueIs('and') ? 'AndExpr' : 'OrExpr';
  let result: T.AndExpr | T.OrExpr = {
    type: logicType,
    expr1: prevExpr,
    expr2: EmptyExpression,
    returnType: 'Bool',
  };

  tt.next();
  result.expr2 = parseExpr(result);
  return result;
}