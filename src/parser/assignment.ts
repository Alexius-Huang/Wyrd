import * as T from '../types';

export function parseAssignmentExpr(
  curTok: T.Token,
  nextToken: () => T.Token,
  parseExpr: (prevExpr?: T.Expr) => T.Expr,
  prevExpr: T.Expr,
): T.AssignmentExpr {
  curTok = nextToken(); // Skip the eq token
  const result: T.AssignmentExpr = {
    type: 'AssignmentExpr',
    expr1: prevExpr,
  };

  result.expr2 = parseExpr();

  return result;
}
