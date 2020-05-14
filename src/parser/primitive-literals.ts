import * as T from '../types';
import TokenTracker from './classes/TokenTracker';
import DT from './classes/DataType';
import { BuiltinOPActions } from './constants';
// import { getOPActionDetail } from './helper';

function parseNumberLiteral(
  tt: TokenTracker,
  prevExpr?: T.Expr
): T.Expr {
  const result: T.NumberLiteral = {
    type: 'NumberLiteral',
    value: tt.value,
    return: DT.Num,
  };

  if (prevExpr?.type === 'BinaryOpExpr') {
    prevExpr.expr2 = result;
    const operation = BuiltinOPActions.get(prevExpr.operator);
    // const opAction = getOPActionDetail(
    //   prevExpr.operator,
    //   prevExpr.expr1.return,
    //   result.return,
    // );

    // prevExpr.return = opAction.return;
    prevExpr.return = operation?.returnTypeOfOperation(
      prevExpr.expr1.return,
      result.return
    ) as DT;
    return prevExpr;
  }
  if (prevExpr?.type === 'PrioritizedExpr') {
    prevExpr.expr = result;
    prevExpr.return = result.return;
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
    return: DT.Str,
  };

  if (prevExpr?.type === 'BinaryOpExpr') {
    prevExpr.expr2 = result;
    return prevExpr;
  }
  if (prevExpr?.type === 'PrioritizedExpr') {
    prevExpr.expr = result;
    prevExpr.return = result.return;
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
    return: DT.Bool,
  };

  if (prevExpr?.type === 'BinaryOpExpr') {
    prevExpr.expr2 = result;
    return prevExpr;
  }
  if (prevExpr?.type === 'PrioritizedExpr') {
    prevExpr.expr = result;
    prevExpr.return = result.return;
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
    return: DT.Null,
  };

  if (prevExpr?.type === 'BinaryOpExpr') {
    prevExpr.expr2 = result;
    return prevExpr;
  }
  if (prevExpr?.type === 'PrioritizedExpr') {
    prevExpr.expr = result;
    prevExpr.return = result.return;
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
