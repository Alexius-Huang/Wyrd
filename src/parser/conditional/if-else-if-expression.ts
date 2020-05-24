import * as T from '../../types';
import { TokenTracker, Scope } from '../utils';
import { ParserError } from '../error';
import { parseConditionalExpr } from '.';

export function parseElseIfExpression(
  tt: TokenTracker,
  parseExpr: T.ExpressionParsingFunction,
  scope: Scope,
  prevExpr: T.ConditionalExpr,
): T.ConditionalExpr {
  const result = { ...prevExpr };
  result.expr2 = parseConditionalExpr(tt, parseExpr, scope);

  /*
   *  Case when elif-expression has no else expression further,
   *  the overall conditional expression should be converted to maybe types
   */
  if (!result.return.nullable && result.expr2.return.nullable)
    result.return = result.return.toNullable();

  if (result.return.isNotEqualTo(result.expr2.return))
    ParserError('Expect values returned from different condition branch to be the same');

  return result;
}
