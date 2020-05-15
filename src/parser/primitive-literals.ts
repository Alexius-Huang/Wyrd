import * as T from '../types';
import { TokenTracker, DataType as DT, BinaryOperator } from './classes';
import { BuiltinOPActions } from './constants';
import { ParserError } from './error';

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
    const operator = BuiltinOPActions.get(prevExpr.operator) as BinaryOperator;
    const operandLeft = prevExpr.expr1.return;
    const operandRight = result.return;
    const operation = operator.getOperationInfo(operandLeft, operandRight);

    if (operation === undefined)
      ParserError(`Invalid operation for operator \`${prevExpr.operator}\` with operands of type ${operandLeft} and ${operandRight}`);

    prevExpr.return = operation.return;
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
