import * as T from '../types';
import { TokenTracker, Scope, DataType as DT } from './utils';
import { ParserErrorIf } from './error';

export function parseListLiteral(
  tt: TokenTracker,
  parseExpr: T.ExpressionParsingFunction,
  scope: Scope,
  prevExpr?: T.Expr,
): T.Expr {
  tt.next(); // Skip lbracket
  const result: T.ListLiteral = {
    type: 'ListLiteral',
    values: [],
    elementType: DT.Invalid,
    return: DT.Invalid,
  };

  // Fetch the first element
  const el = parseExpr(undefined, { scope });
  result.values.push(el);
  result.elementType = el.return;
  result.return = DT.ListOf(el.return);
  tt.next();

  // Fetch the rest of the elements until meet `rbracket` token
  while (tt.isNot('rbracket')) {
    let el = parseExpr(undefined, { scope });
    ParserErrorIf(
      el.return.isNotEqualTo(result.elementType),
      `Expect List to contain of type \`${result.elementType}\`, instead mixed with type \`${el.return}\``
    );

    // Since the expression will be already separated by comma
    // We can strip down the prioritized expression layer
    if (el.type === 'PrioritizedExpr')
      el = el.expr;

    result.values.push(el);
    tt.next();
  }

  return result;
}
