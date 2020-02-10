import * as T from '../types';
import TokenTracker from './TokenTracker';
import Scope from './Scope';
import Variable from './Scope.Variable';
import { getOPActionDetail } from './helper';
import { parseFunctionInvokeExpr } from './function-invocation';
import { ParserErrorIf } from './error';

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
    returnType: 'Invalid',
  };

  /* Find the variable through scope chain */
  // TODO: Refactor Scope, maybe use a class to represent scopes and functions
  //       and let finding variables and functions become member methods
  let varInfo: Variable | undefined;
  let currentScope = scope;
  while (true) {
    if (currentScope.hasVariable(tokenName)) {
      varInfo = currentScope.getVariable(tokenName);
      result.returnType = varInfo.type;
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
      result.returnType === 'Invalid',
      `Using the unidentified token \`${tokenName}\``
    );

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
