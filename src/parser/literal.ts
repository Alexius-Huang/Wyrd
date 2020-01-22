import * as T from '../types';

export function parseLiteral(
  curTok: T.Token,
  nextToken: () => T.Token,
  prevExpr?: T.Expr,
): T.Expr {
  const result: T.IdentLiteral = { type: 'IdentLiteral', value: curTok.value };

  if (prevExpr?.type === 'BinaryOpExpr') {
    prevExpr.expr2 = result;
    return prevExpr;
  }
  if (prevExpr?.type === 'PrioritizedExpr') {
    prevExpr.expr = result;
  }
  if (prevExpr?.type === 'FunctionDeclaration') {
    prevExpr.body.push(result);
    return prevExpr;
  }
  return result;
}

export function parseNumberLiteral(
  curTok: T.Token,
  nextToken: () => T.Token,
  prevExpr?: T.Expr
): T.Expr {
  const result: T.NumberLiteral = { type: 'NumberLiteral', value: curTok.value };

  if (prevExpr?.type === 'BinaryOpExpr') {
    prevExpr.expr2 = result;
    return prevExpr;
  }
  if (prevExpr?.type === 'PrioritizedExpr') {
    prevExpr.expr = result;
  }
  if (prevExpr?.type === 'FunctionDeclaration') {
    prevExpr.body.push(result);
    return prevExpr;
  }
  return result;
}
