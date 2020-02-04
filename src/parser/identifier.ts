import * as T from '../types';
import { getOPActionDetail } from './helper';
import { parseFunctionInvokeExpr } from './function-invocation';
import TokenTracker from './TokenTracker';
import { ParserErrorIf } from './error';

export function parseIdentifier(
  tt: TokenTracker,
  parseExpr: (prevExpr?: T.Expr, meta?: any) => T.Expr,
  scope: T.Scope,
  prevExpr?: T.Expr,
): T.Expr {
  const tokenName = tt.value;
  let result: T.IdentLiteral | T.FunctionInvokeExpr = {
    type: 'IdentLiteral',
    value: tokenName,
    returnType: 'Invalid',
  };
  const { functions } = scope;

  /* Find the variable through scope chain */
  // TODO: Refactor Scope, maybe use a class to represent scopes and functions
  //       and let finding variables and functions become member methods
  let varInfo: T.Variable | undefined;
  let currentScope = scope;
  while (true) {
    const { variables: v } = currentScope;
    if (v.has(tokenName)) {
      varInfo = v.get(tokenName) as T.Variable;
      result.returnType = varInfo.type;
      break;
    }

    if (currentScope.parentScope === null) break;
    currentScope = currentScope.parentScope;
  }

  if (varInfo === undefined && functions.has(tokenName)) {
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
