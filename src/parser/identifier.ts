import * as T from '../types';
import { TokenTracker, Scope, ScopeVariable as Variable, DataType as DT, BinaryOperator } from './utils';
import { parseFunctionInvokeExpr } from './function-invocation';
import { ParserErrorIf, ParserError } from './error';
import { BuiltinOPActions } from './constants';
import { parseAssignmentExpr } from './assignment';

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

    prevExpr.return = operation.return;
    return prevExpr;
  }

  if (prevExpr?.type === 'PrioritizedExpr') {
    prevExpr.expr = result;
    prevExpr.return = result.return;
  }

  if (result.type === 'IdentLiteral' && result.return.isEqualTo(DT.Invalid)) {
    tt.next(); // Skip the current identifier

    /* Handle Assignment Expression when identifier is unknown */
    if (tt.is('eq'))
      return parseAssignmentExpr(tt, parseExpr, scope, result);

    ParserError(`Using the unidentified token \`${result.value}\``)
  }

  return result;
}
