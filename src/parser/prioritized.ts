import * as T from '../types';
import { ParserError } from './error';

export function parsePrioritizedExpr(
  curTok: T.Token,
  nextToken: () => T.Token,
  parseExpr: (prevExpr?: T.Expr) => T.Expr,
  prevExpr?: T.Expr,
): T.Expr {
  curTok = nextToken(); // Skip the lparen token
  let result: T.PrioritizedExpr = { type: 'PrioritizedExpr' };

  while (true) {
    result.expr = parseExpr(result);
    curTok = nextToken();
    if (curTok.type === 'rparen') break;
  }

  if (prevExpr !== undefined) {
    if (prevExpr.type === 'BinaryOpExpr') {
      prevExpr.expr2 = result;
      return prevExpr;
    }

    if (prevExpr.type === 'FunctionDeclaration') {
      prevExpr.body.push(result);
      return prevExpr;
    }

    ParserError(`Unhandled parsing prioritized expression based on expression of type \`${prevExpr.type}\``);
  }

  return result;
}
