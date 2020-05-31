import * as T from '../types';
import { TokenTracker, Scope, DataType as DT } from './utils';
import { ParserError } from './error';

export function parseThisLiteral(
  tt: TokenTracker,
  scope: Scope,
  prevExpr?: T.Expr
): T.Expr {
  const result: T.ThisLiteral = {
    type: 'ThisLiteral',
    return: DT.Invalid,
  };

  if (scope.hasVariable('this')) {
    result.return = scope.getVariable('this').type;
  } else {
    ParserError('Unhandled using `this` keyword token');
  }

  // TODO: The following code handling binary operation and prioritization is duplicated
  //       with primitive type parsing, find a way to refactor them
  if (prevExpr?.type === 'BinaryOpExpr') {
    prevExpr.expr2 = result;
    const operator = prevExpr.operator;
    const opLeft = prevExpr.expr1.return;
    const opRight = result.return;
    const operatorObj = scope.getOperatorPattern(operator, opLeft, opRight);

    if (operatorObj === undefined)
      ParserError(`Invalid operation for operator \`${prevExpr.operator}\` with operands of type \`${opLeft}\` and \`${opRight}\``);

    prevExpr.return = operatorObj.returnDataType;
    return prevExpr;
  }

  if (prevExpr?.type === 'PrioritizedExpr') {
    prevExpr.expr = result;
    prevExpr.return = result.return;
  }
  return result;
}