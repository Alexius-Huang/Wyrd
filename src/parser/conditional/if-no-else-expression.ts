import * as T from '../../types';
import { TokenTracker, Scope } from '../utils';

export function parseIfArrowNoElseExpr(
  tt: TokenTracker,
  parseExpr: T.ExpressionParsingFunction,
  scope: Scope,
  prevExpr: T.ConditionalExpr
): T.ConditionalExpr {
  const result = { ...prevExpr };
  result.return = result.return.toNullable();

  return result;
}

export function parseIfThenNoElseExpr(
  tt: TokenTracker,
  parseExpr: T.ExpressionParsingFunction,
  scope: Scope,
  prevExpr: T.ConditionalExpr
): T.ConditionalExpr {
  const result = { ...prevExpr };
  result.return = result.return.toNullable();

  if (tt.peekIs('keyword') && tt.peekValueIs('end')) 
    tt.next(); // Skip `end` keyword
  return result;
}
