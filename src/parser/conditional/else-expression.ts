import * as T from '../../types';
import { TokenTracker, Scope } from '../utils';
import { ParserError, ParserErrorIf } from '../error';

export function parseElseExpression(
  tt: TokenTracker,
  parseExpr: T.ExpressionParsingFunction,
  scope: Scope,
  prevExpr: T.ConditionalExpr,
): T.ConditionalExpr {
  let result = { ...prevExpr };
  tt.next(); // Skip 'else' keyword

  if (tt.is('arrow'))
    result = parseElseArrowExpr(tt, parseExpr, scope, result);
  else if (tt.valueIs('then'))
    result = parseElseThenExpr(tt, parseExpr, scope, result);
  else 
    ParserError('Expect else condition to followed by arrow `=>` or the `then` keyword');

  return result;
}

function parseElseArrowExpr(
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

function parseElseThenExpr(
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
