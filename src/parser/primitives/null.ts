import * as T from '../../types';
import { TokenTracker, DataType as DT, Scope } from '../utils';
import { ParserError } from '../error';

export function parseNullLiteral(
  tt: TokenTracker,
  scope: Scope,
  prevExpr?: T.Expr
): T.Expr {
  const result: T.NullLiteral = {
    type: 'NullLiteral',
    value: 'Null',
    return: DT.Null,
  };

  if (prevExpr?.type === 'BinaryOpExpr') {
    prevExpr.expr2 = result;
    const operator = prevExpr.operator;
    const opLeft = prevExpr.expr1.return;
    const operatorObj = scope.getOperatorPattern(operator, opLeft, DT.Null);

    if (operatorObj === undefined)
      ParserError(`Invalid operation for operator \`${prevExpr.operator}\` with operands of type \`${opLeft}\` and \`${DT.Null}\``);

    prevExpr.return = operatorObj.returnDataType;
    return prevExpr;
  }
  if (prevExpr?.type === 'PrioritizedExpr') {
    prevExpr.expr = result;
    prevExpr.return = result.return;
  }
  return result;
}

