import * as T from '../types';
import TokenTracker from './TokenTracker';
import Scope from './Scope';
import { ParserErrorIf } from './error';

export function parseListLiteral(
  tt: TokenTracker,
  parseExpr: (prevExpr?: T.Expr, meta?: any) => T.Expr,
  scope: Scope,
  prevExpr?: T.Expr,
): T.Expr {
  tt.next(); // Skip lbracket
  const result: T.ListLiteral = {
    type: 'ListLiteral',
    values: [],
    elementType: 'Invalid',
    returnType: 'Invalid',
  };

  // Fetch the first element
  const el = parseExpr(undefined, { scope });
  result.values.push(el);
  result.elementType = el.returnType;
  result.returnType = `List[${el.returnType}]`;
  tt.next();

  // Fetch the rest of the elements until meet `rbracket` token
  while (tt.isNot('rbracket')) {
    let el = parseExpr(undefined, { scope });
    ParserErrorIf(
      el.returnType !== result.elementType,
      `Expect List to contain of type \`${result.elementType}\`, instead mixed with type \`${el.returnType}\``
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
