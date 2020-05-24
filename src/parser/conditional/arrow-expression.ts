import * as T from '../../types';
import { TokenTracker, Scope } from '../utils';
import { ParserErrorIf, ParserError } from '../error';
import { parseElseIfExpression } from './else-if-expression';
import { parseSecondaryThenExpr } from './then-expression';

export function parsePrimaryArrowExpr(
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

  if (
    /* Without-Else expression and last line condition */
    !tt.hasNext() ||

    /* Without-else-expression condition */
    !(tt.peekIs('keyword') && tt.peekValueIsOneOf('elif', 'else'))
  ) {
    result.return = result.return.toNullable();
    return result;
  }

  tt.next(); // Skip `newline`

  /* Handle elif is exactly the same as the if expression */
  if (tt.is('keyword') && tt.valueIs('elif'))
    return parseElseIfExpression(tt, parseExpr, scope, result);

  /* Handle else expression */
  if (tt.is('keyword') && tt.valueIs('else')) {
    tt.next(); // Skip 'else' keyword

    if (tt.isNot('arrow') && tt.valueIsNot('then'))
      ParserError('Expect else condition to followed by arrow `=>` or the `then` keyword');

    if (tt.is('arrow'))
      result = parseSecondaryArrowExpr(tt, parseExpr, scope, result);
    else if (tt.valueIs('then'))
      result = parseSecondaryThenExpr(tt, parseExpr, scope, result);
  }

  if (result.expr2.return.isNotEqualTo(result.return))
    ParserError(`Expect values returned from different condition branch to be the same`);

  return result;
}


export function parseSecondaryArrowExpr(
  tt: TokenTracker,
  parseExpr: T.ExpressionParsingFunction,
  scope: Scope,
  prevExpr: T.ConditionalExpr,
): T.ConditionalExpr {
  let result = { ...prevExpr };

  tt.next(); // Skip 'arrow' keyword

  while (tt.isNot('newline')) {
    result.expr2 = parseExpr(result, { target: 'expr2', scope });
    tt.next();
  }

  return result;
}
