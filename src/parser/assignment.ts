import * as T from '../types';
import { ParserError } from './error';

export function parseAssignmentExpr(
  curTok: T.Token,
  nextToken: () => T.Token,
  parseExpr: (prevExpr?: T.Expr) => T.Expr,
  prevExpr: T.Expr,
): [T.Token, T.Expr] {
  curTok = nextToken(); // Skip the eq token
  if (prevExpr?.type === 'IdentLiteral') {
    const result: T.AssignmentExpr = {
      type: 'AssignmentExpr',
      expr1: prevExpr,
    };

    result.expr2 = parseExpr();
    return [curTok, result];
  }

  if (prevExpr?.type === 'FunctionDeclaration') {
    const result: T.AssignmentExpr = {
      type: 'AssignmentExpr',
      expr1: prevExpr.body.pop() as T.Expr,
    };

    result.expr2 = parseExpr(result);
    prevExpr.body.push(result);
    return [curTok, prevExpr];
  }

  ParserError(`Unhandled expression of type \`${prevExpr.type}\``)
}
