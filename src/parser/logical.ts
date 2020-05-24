import * as T from '../types';
import { TokenTracker, DataType as DT } from './utils';
import { EmptyExpression } from './constants';

export function parseLogicalNotExpr(
  tt: TokenTracker,
  parseExpr: T.ExpressionParsingFunction,
): T.Expr {
  let result: T.NotExpr = {
    type: 'NotExpr',
    expr: EmptyExpression,
    return: DT.Bool,
  };
  tt.next();
  result.expr = parseExpr(result);
  return result;
}

export function parseLogicalAndOrExpr(
  tt: TokenTracker,
  parseExpr: T.ExpressionParsingFunction,
  prevExpr: T.Expr,
): T.Expr {
  const logicType = tt.valueIs('and') ? 'AndExpr' : 'OrExpr';
  let result: T.AndExpr | T.OrExpr = {
    type: logicType,
    expr1: prevExpr,
    expr2: EmptyExpression,
    return: DT.Bool,
  };

  tt.next();
  result.expr2 = parseExpr(result);
  return result;
}
