import * as T from '../types';
import { getOPActionDetail } from './helper';
import { parseFunctionInvokeExpr } from './function-invocation';
import TokenTracker from './TokenTracker';

export function parseLiteral(
  tt: TokenTracker,
  parseExpr: (prevExpr?: T.Expr, meta?: any) => T.Expr,
  scope: T.Scope,
  prevExpr?: T.Expr,
): T.Expr {
  let result: T.IdentLiteral | T.FunctionInvokeExpr = {
    type: 'IdentLiteral',
    value: tt.value,
    returnType: 'Unknown',
  };
  const { variables, functions } = scope;

  if (variables.has(result.value)) {
    const varInfo = variables.get(result.value) as T.Variable;
    result.returnType = varInfo.type;
  } else if (functions.has(result.value)) {
    result = parseFunctionInvokeExpr(tt, parseExpr, scope, prevExpr);
  }

  if (prevExpr?.type === 'BinaryOpExpr') {
    prevExpr.expr2 = result;
    const opAction = getOPActionDetail(
      prevExpr.operator,
      prevExpr.expr1.returnType,
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

export function parseNumberLiteral(
  tt: TokenTracker,
  prevExpr?: T.Expr
): T.Expr {
  const result: T.NumberLiteral = {
    type: 'NumberLiteral',
    value: tt.value,
    returnType: 'Num',
  };

  if (prevExpr?.type === 'BinaryOpExpr') {
    prevExpr.expr2 = result;
    const opAction = getOPActionDetail(
      prevExpr.operator,
      prevExpr.expr1.returnType,
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
  tt: TokenTracker,
  prevExpr?: T.Expr
): T.Expr {
  const result: T.StringLiteral = {
    type: 'StringLiteral',
    value: tt.value,
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
  tt: TokenTracker,
  prevExpr?: T.Expr
): T.Expr {
  const result: T.BooleanLiteral = {
    type: 'BooleanLiteral',
    value: tt.value as 'True' | 'False',
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
  tt: TokenTracker,
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
