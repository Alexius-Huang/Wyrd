import * as T from '../../types';
import { TokenTracker, Scope, DataType as DT } from '../utils';
import { ParserErrorIf, ParserError } from '../error';

export function parseIfArrowExpr(
  tt: TokenTracker,
  parseExpr: T.ExpressionParsingFunction,
  scope: Scope,
  prevExpr: T.ConditionalExpr
): T.ConditionalExpr {
  let result = { ...prevExpr };

  tt.next(); // Skip '=>' inline-control operator

  while (tt.isNot('newline')) {
    result.expr1 = parseExpr(result.expr1, { target: 'expr1', scope });
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

export function parseIfBlockExpr(
  tt: TokenTracker,
  parseExpr: T.ExpressionParsingFunction,
  scope: Scope,
  prevExpr: T.ConditionalExpr,
): T.ConditionalExpr {
  let result = { ...prevExpr };

  tt.next(); // Skip 'do' keyword
  ParserErrorIf(tt.isNot('newline'), 'Expect no tokens after `do` keyword');

  tt.next(); // Skip `newline`

  const blockExpr: T.DoBlockExpr = {
    type: 'DoBlockExpr',
    body: [],
    return: DT.Unknown
  };

  const doBlockScope = scope.createChildScope('if-conditional-block');
  while (!(tt.peekIs('keyword') && tt.peekValueIsOneOf('else', 'elif', 'end'))) {
    if (tt.isNot('newline')) {
      const expr = parseExpr(undefined, { ast: blockExpr.body, scope: doBlockScope });
      expr.type !== 'VoidExpr' && blockExpr.body.push(expr);
    }

    tt.next();
  }

  if (blockExpr.body.length === 0)
    ParserError(`Do-Block Expression cannot be blank`);
  blockExpr.return = blockExpr.body[blockExpr.body.length - 1].return;
  result.expr1 = blockExpr;
  result.return = blockExpr.return;
  return result;
}