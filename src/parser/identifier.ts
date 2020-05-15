import * as T from '../types';
import { TokenTracker, Scope, ScopeVariable as Variable, DataType as DT, BinaryOperator } from './classes';
import { parseFunctionInvokeExpr } from './function-invocation';
import { ParserErrorIf, ParserError } from './error';
import { BuiltinOPActions } from './constants';

export function parseIdentifier(
  tt: TokenTracker,
  parseExpr: (prevExpr?: T.Expr, meta?: any) => T.Expr,
  scope: Scope,
  prevExpr?: T.Expr,
): T.Expr {
  const tokenName = tt.value;
  let result: T.IdentLiteral | T.FunctionInvokeExpr = {
    type: 'IdentLiteral',
    value: tokenName,
    return: DT.Invalid,
  };

  /* Find the variable through scope chain */
  // TODO: Refactor Scope, maybe use a class to represent scopes and functions
  //       and let finding variables and functions become member methods
  let varInfo: Variable | undefined;
  let currentScope = scope;

  while (true) {
    if (currentScope.hasVariable(tokenName)) {
      varInfo = currentScope.getVariable(tokenName);
      result.return = varInfo.type;
      break;
    }

    if (currentScope.parent === null) break;
    currentScope = currentScope.parent;
  }

  // TODO: Find function recursively
  if (varInfo === undefined && scope.hasFunction(tokenName)) {
    result = parseFunctionInvokeExpr(tt, parseExpr, scope, prevExpr);
  }

  if (prevExpr?.type === 'BinaryOpExpr') {
    ParserErrorIf(
      DT.isInvalid(result.return),
      `Using the unidentified token \`${tokenName}\``
    );

    prevExpr.expr2 = result;
    const operator = BuiltinOPActions.get(prevExpr.operator) as BinaryOperator;
    const operandLeft = prevExpr.expr1.return;
    const operandRight = result.return;
    const operation = operator.getOperationInfo(operandLeft, operandRight);

    if (operation === undefined)
      ParserError(`Invalid operation for operator \`${prevExpr.operator}\` with operands of type ${operandLeft} and ${operandRight}`);

    prevExpr.return = operation?.return;
    return prevExpr;
  }

  if (prevExpr?.type === 'PrioritizedExpr') {
    prevExpr.expr = result;
    prevExpr.return = result.return;
  }

  return result;
}
