import * as T from '../../types';
import { TokenTracker, Scope } from '../utils';
import { ParserError, ParserErrorIf } from '../error';

export function parseBlock(
  tt: TokenTracker,
  parseExpr: T.ExpressionParsingFunction,
  scope: Scope,
  prevExpr: T.Expr,
): T.Expr {``
  tt.next(); // Skip keyword `do`

  ParserErrorIf(tt.isNot('newline'), 'Invalid to contain any expressions after the `do` keyword');
  tt.next(); // Skip newline

  if (
    prevExpr.type === 'FunctionDeclaration' ||
    prevExpr.type === 'MethodDeclaration'
  ) {
    while (!(tt.is('keyword') && tt.valueIs('end'))) {
      if (tt.is('newline')) {
        tt.next();
        continue;
      }

      prevExpr.body.push(parseExpr(undefined, { scope, ast: prevExpr.body }));
      tt.next();
    }

    tt.next();
    return prevExpr;
  }

  ParserError(`Unhandled parsing block-level expression with expression of type \`${prevExpr.type}\``)
}
