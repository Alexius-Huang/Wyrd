import * as T from '../../types';
import { TokenTracker, Scope, DataType as DT } from '../utils';
import { ParserErrorIf, ParserError } from '../error';

export function parseListLiteral(
  tt: TokenTracker,
  parseExpr: T.ExpressionParsingFunction,
  scope: Scope,
  prevExpr?: T.Expr,
): T.Expr {
  tt.next(); // Skip `builtin-type: List`
  tt.next(); // SKip `of` keyword

  let listOfType: DT;
  // TODO: Support list of lists/records or tuples ... etc
  if (tt.is('builtin-type') || tt.is('null'))
   listOfType = new DT(tt.value);
  else
    ParserError(`Expect List type to provide the type of the data, instead got token of type: \`${tt.type}\``);

  const listType = DT.ListOf(listOfType);
  tt.next(); // Skip `builtin-type`

  if (tt.isNot('lbracket'))
    ParserError(`Expect List literal to start with left bracket, instead got token of type \`${tt.type}\``);

  tt.next(); // Skip lbracket
  const result: T.ListLiteral = {
    type: 'ListLiteral',
    values: [],
    elementType: listOfType,
    return: listType,
  };

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
