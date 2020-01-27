import * as T from '../types';
import { getOPActionDetail } from './helper';

export function parseLiteral(
  curTok: T.Token,
  nextToken: () => T.Token,
  scope: T.Scope,
  prevExpr?: T.Expr,
): T.Expr {
  const result: T.IdentLiteral = { type: 'IdentLiteral', value: curTok.value, returnType: 'Unknown' };
  const varInfo = scope.variables.get(result.value);
  if (varInfo) {
    result.returnType = varInfo.type;
  }

  if (prevExpr?.type === 'BinaryOpExpr') {
    prevExpr.expr2 = result;
    const opAction = getOPActionDetail(
      prevExpr.operator,
      /* TODO: Remove this annotation if complete all expressions have returnType */
      (prevExpr.expr1 as T.NumberLiteral).returnType,
      result.returnType as string,
    );

    prevExpr.returnType = opAction.returnType;
    return prevExpr;
  }
  if (prevExpr?.type === 'PrioritizedExpr') {
    prevExpr.expr = result;
    prevExpr.returnType = result.returnType;
  }
  return result;
}

export function parseNumberLiteral(
  curTok: T.Token,
  nextToken: () => T.Token,
  prevExpr?: T.Expr
): T.Expr {
  const result: T.NumberLiteral = {
    type: 'NumberLiteral',
    value: curTok.value,
    returnType: 'Num',
  };

  if (prevExpr?.type === 'BinaryOpExpr') {
    prevExpr.expr2 = result;
    const opAction = getOPActionDetail(
      prevExpr.operator,
      /* TODO: Remove this annotation if complete all expressions have returnType */
      (prevExpr.expr1 as T.NumberLiteral).returnType,
      result.returnType,
    );

    prevExpr.returnType = opAction.returnType;
    return prevExpr;
  }
  if (prevExpr?.type === 'PrioritizedExpr') {
    prevExpr.expr = result;
    prevExpr.returnType = result.returnType;
  }
  return result;
}

export function parseStringLiteral(
  curTok: T.Token,
  nextToken: () => T.Token,
  prevExpr?: T.Expr
): T.Expr {
  const result: T.StringLiteral = {
    type: 'StringLiteral',
    value: curTok.value,
    returnType: 'Str',
  };

  if (prevExpr?.type === 'BinaryOpExpr') {
    prevExpr.expr2 = result;
    return prevExpr;
  }
  if (prevExpr?.type === 'PrioritizedExpr') {
    prevExpr.expr = result;
    prevExpr.returnType = result.returnType;
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
    value: curTok.value as 'True' | 'False',
    returnType: 'Bool',
  };

  if (prevExpr?.type === 'BinaryOpExpr') {
    prevExpr.expr2 = result;
    return prevExpr;
  }
  if (prevExpr?.type === 'PrioritizedExpr') {
    prevExpr.expr = result;
    prevExpr.returnType = result.returnType;
  }
  return result;
}

export function parseNullLiteral(
  curTok: T.Token,
  nextToken: () => T.Token,
  prevExpr?: T.Expr
): T.Expr {
  const result: T.NullLiteral = {
    type: 'NullLiteral',
    value: 'Null',
    returnType: 'Null',
  };

  if (prevExpr?.type === 'BinaryOpExpr') {
    prevExpr.expr2 = result;
    return prevExpr;
  }
  if (prevExpr?.type === 'PrioritizedExpr') {
    prevExpr.expr = result;
    prevExpr.returnType = result.returnType;
  }
  return result;
}
