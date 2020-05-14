import * as T from '../types';
import TokenTracker from './classes/TokenTracker';
import Scope from './classes/Scope';
import DT from './classes/DataType';
import { ParserError } from './error';
// import { getOPActionDetail } from './helper';
import { EmptyExpression, BuiltinOPActions } from './constants';

export function parsePrioritizedExpr(
  tt: TokenTracker,
  parseExpr: (prevExpr?: T.Expr, meta?: any) => T.Expr,
  scope: Scope,
  prevExpr?: T.Expr,
): T.Expr {
  tt.next(); // Skip the lparen token
  let result: T.PrioritizedExpr = {
    type: 'PrioritizedExpr',
    expr: EmptyExpression,
    return: DT.Invalid,
  };

  while (tt.isNotOneOf('rparen', 'comma')) {
    result.expr = parseExpr(result, { scope });
    tt.next();
  }

  if (prevExpr !== undefined) {
    if (prevExpr.type === 'BinaryOpExpr') {
      prevExpr.expr2 = result;

      // const opAction = getOPActionDetail(
      //   prevExpr.operator,
      //   prevExpr.expr2.return,
      //   result.return
      // );

      // prevExpr.return = opAction.return;
      const operator = BuiltinOPActions.get(prevExpr.operator);
      prevExpr.return = operator?.returnTypeOfOperation(
        prevExpr.expr2.return,
        result.return
      ) as DT;

      return prevExpr;
    }

    if (prevExpr.type === 'PrioritizedExpr') {
      prevExpr.expr = result;
      prevExpr.return = result.return;
      return result;
    }

    if (prevExpr.type === 'NotExpr') {
      prevExpr.expr = result;
      return result;
    }

    ParserError(`Unhandled parsing prioritized expression based on expression of type \`${prevExpr.type}\``);
  }

  if (result.expr.type === 'FunctionInvokeExpr')
    return result.expr;

  result.return = result.expr.return;
  return result;
}
