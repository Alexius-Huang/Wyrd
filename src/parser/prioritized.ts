import * as T from '../types';
import { TokenTracker, Scope, DataType as DT, BinaryOperator } from './classes';
import { ParserError } from './error';
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
      const operator = BuiltinOPActions.get(prevExpr.operator) as BinaryOperator;
      const operandLeft = prevExpr.expr1.return;
      const operandRight = result.return;
      const operation = operator.getOperationInfo(operandLeft, operandRight);

      if (operation === undefined)
        ParserError(`Invalid operation for operator \`${prevExpr.operator}\` with operands of type ${operandLeft} and ${operandRight}`);

      prevExpr.return = operation.return;
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
