import * as T from '../../types';
import { TokenTracker, Scope } from '../utils';
import { ParserErrorIf } from '../error';

export function parseIfArrowExpr(
  tt: TokenTracker,
  parseExpr: T.ExpressionParsingFunction,
  scope: Scope,
  prevExpr: T.ConditionalExpr
): T.ConditionalExpr {
  let result = { ...prevExpr };

  tt.next(); // Skip '=>' inline-control operator

  while (tt.isNot('newline')) {
    result.expr1 = parseExpr(result.expr1, { target: 'expr1' });
    tt.next();
  }
  result.return = result.expr1.return;
  return result;
}

export function parseIfThenExpr(
  tt: TokenTracker,
  parseExpr: T.ExpressionParsingFunction,
  scope: Scope,
  prevExpr: T.ConditionalExpr,
): T.ConditionalExpr {
  let result = { ...prevExpr };

  tt.next(); // Skip 'then' keyword
  ParserErrorIf(tt.isNot('newline'), 'Expect no tokens after `then` keyword');

  tt.next(); // Skip `newline`

  while (tt.isNot('newline')) {
    result.expr1 = parseExpr(result.expr1, { target: 'expr1', scope });
    tt.next();
  }
  result.return = result.expr1.return;
  return result;
}
