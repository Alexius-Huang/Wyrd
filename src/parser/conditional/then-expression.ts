import * as T from '../../types';
import { TokenTracker, Scope } from '../utils';
import { ParserErrorIf, ParserError } from '../error';
import { parseElseIfExpression } from './else-if-expression';
import { parseSecondaryArrowExpr } from './arrow-expression';

export function parsePrimaryThenExpr(
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

  if (
    /* Without-Else expression and last line condition */
    !tt.hasNext() ||

    /* Without-else-expression condition */
    !(tt.peekIs('keyword') && tt.peekValueIsOneOf('elif', 'else'))
  ) {
    result.return = result.return.toNullable();

    if (tt.peekIs('keyword') && tt.peekValueIs('end')) 
      tt.next(); // Skip `end` keyword
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

export function parseSecondaryThenExpr(
  tt: TokenTracker,
  parseExpr: T.ExpressionParsingFunction,
  scope: Scope,
  prevExpr: T.ConditionalExpr,
): T.ConditionalExpr {
  let result = { ...prevExpr };

  tt.next(); // Skip 'then' keyword
  if (tt.is('newline')) {
    tt.next(); // Skip 'newline' token

    while (tt.isNot('newline')) {
      result.expr2 = parseExpr(result, { target: 'expr2', scope });
      tt.next();
    }

    tt.next(); // Skip 'newline' token
    ParserErrorIf(tt.valueIsNot('end'), 'Expect `else then` expression to followed by an `end` keyword');

    tt.next(); // Skip 'end' token
    ParserErrorIf(tt.isNot('newline'), 'Expect no tokens after `end` keyword');
  }
  return result;
}
