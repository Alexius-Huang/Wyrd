import * as T from '../types';
import { getOPActionDetail } from './helper';
import TokenTracker from './TokenTracker';

function parseNumberLiteral(
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

function parseStringLiteral(
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

function parseBooleanLiteral(
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

function parseNullLiteral(
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

const primitiveMapParsingFunctions = new Map([
  ['number', parseNumberLiteral],
  ['string', parseStringLiteral],
  ['boolean', parseBooleanLiteral],
  ['null', parseNullLiteral],
]);

export function parsePrimitive(
  tt: TokenTracker,
  prevExpr?: T.Expr,
) {
  const func = primitiveMapParsingFunctions.get(tt.type) as
    (tt: TokenTracker, prevExpr?: T.Expr) => T.Expr;
  return func(tt, prevExpr);
}
