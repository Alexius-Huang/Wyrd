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

export function parseStringLiteral(
  curTok: T.Token,
  nextToken: () => T.Token,
  prevExpr?: T.Expr
): T.Expr {
  const result: T.StringLiteral = { type: 'StringLiteral', value: curTok.value };

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

export function parseBooleanLiteral(
  curTok: T.Token,
  nextToken: () => T.Token,
  prevExpr?: T.Expr
): T.Expr {
  const result: T.BooleanLiteral = {
    type: 'BooleanLiteral',
    value: curTok.value as 'True' | 'False'
  };

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

export function parseNullLiteral(
  curTok: T.Token,
  nextToken: () => T.Token,
  prevExpr?: T.Expr
): T.Expr {
  const result: T.NullLiteral = { type: 'NullLiteral', value: 'Null' };

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
