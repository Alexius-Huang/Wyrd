import * as T from '../types';
import { getOPActionDetail } from './helper';
import { parseFunctionInvokeExpr } from './function-invocation';

export function parseLiteral(
  curTok: T.Token,
  nextToken: () => T.Token,
  currentToken: () => T.Token,
  parseExpr: (prevExpr?: T.Expr, meta?: any) => T.Expr,
  scope: T.Scope,
  prevExpr?: T.Expr,
): T.Expr {
  let result: T.IdentLiteral | T.FunctionInvokeExpr = {
    type: 'IdentLiteral',
    value: curTok.value,
    returnType: 'Unknown',
  };
  const { variables, functions } = scope;

  if (variables.has(result.value)) {
    const varInfo = variables.get(result.value) as T.Variable;
    result.returnType = varInfo.type;
  } else if (functions.has(result.value)) {
    result = parseFunctionInvokeExpr(curTok, nextToken, currentToken, parseExpr, scope, prevExpr);
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
