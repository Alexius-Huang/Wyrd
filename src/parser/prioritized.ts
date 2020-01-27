import * as T from '../types';
import { ParserError } from './error';
import { getOPActionDetail } from './helper';

export function parsePrioritizedExpr(
  curTok: T.Token,
  nextToken: () => T.Token,
  parseExpr: (prevExpr?: T.Expr, meta?: any) => T.Expr,
  scope: T.Scope,
  prevExpr?: T.Expr,
): T.Expr {
  curTok = nextToken(); // Skip the lparen token
  let result: T.PrioritizedExpr = { type: 'PrioritizedExpr' };

  while (true) {
    result.expr = parseExpr(result, { scope });
    curTok = nextToken();
    if (curTok.type === 'rparen') break;
  }

  if (prevExpr !== undefined) {
    if (prevExpr.type === 'BinaryOpExpr') {
      prevExpr.expr2 = result;
      const opAction = getOPActionDetail(
        prevExpr.operator,
        prevExpr.expr2.returnType as string,
        result.returnType as string
      );

      prevExpr.returnType = opAction.returnType;
      return prevExpr;
    }

    if (prevExpr.type === 'FunctionDeclaration') {
      prevExpr.body.push(result);
      return prevExpr;
    }

    if (prevExpr.type === 'NotExpr') {
      prevExpr.expr = result;
      return result;
    }

    ParserError(`Unhandled parsing prioritized expression based on expression of type \`${prevExpr.type}\``);
  }

  // TODO: Remove this if every expression support returnType
  result.returnType = (result.expr as T.BinaryOpExpr).returnType;
  return result;
}
