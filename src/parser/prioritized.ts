import * as T from '../types';
import { TokenTracker, Scope, DataType as DT } from './utils';
import { ParserError } from './error';
import { EmptyExpression } from './constants';

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
      const operator = prevExpr.operator;
      const opLeft = prevExpr.expr1.return;
      const opRight = result.return;
      const operatorObj = scope.getOperatorPattern(operator, opLeft, opRight);
  
      if (operatorObj === undefined)
        ParserError(`Invalid operation for operator \`${prevExpr.operator}\` with operands of type \`${opLeft}\` and \`${opRight}\``);
  
      prevExpr.return = operatorObj.returnDataType;
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
