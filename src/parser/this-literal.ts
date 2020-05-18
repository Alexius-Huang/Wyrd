import * as T from '../types';
import { TokenTracker, Scope, DataType as DT } from './utils';
import { ParserError } from './error';

export function parseThisLiteral(
  tt: TokenTracker,
  scope: Scope,
  prevExpr?: T.Expr
): T.Expr {
  const result: T.ThisLiteral = {
    type: 'ThisLiteral',
    return: DT.Invalid,
  };

  if (scope.hasVariable('this')) {
    result.return = scope.getVariable('this').type;
  } else {
    ParserError('Unhandled using `this` keyword token');
  }

  if (prevExpr?.type === 'BinaryOpExpr') {
    prevExpr.expr2 = result;
    return prevExpr;
  }
  if (prevExpr?.type === 'PrioritizedExpr') {
    prevExpr.expr = result;
    prevExpr.return = result.return;
  }
  return result;
}