import * as T from '../types';
import TokenTracker from './TokenTracker';
import { ParserError, ParserErrorIf } from './error';

export function parseAssignmentExpr(
  tt: TokenTracker,
  parseExpr: (prevExpr?: T.Expr, meta?: any) => T.Expr,
  scope: T.Scope,
  prevExpr: T.Expr,
): T.Expr {
  tt.next(); // Skip the `eq` token

  if (prevExpr?.type === 'IdentLiteral') {
    // Check if variable is constant and redeclared in the same scope
    const varName = prevExpr.value;
    if (scope.variables.has(varName)) {
      const variableInfo = scope.variables.get(varName) as T.Variable;
      ParserErrorIf(variableInfo.isConst, `Constant \`${varName}\` cannot be reassigned`);
    }

    const result: T.AssignmentExpr = {
      type: 'AssignmentExpr',
      expr1: prevExpr,
    };

    const variableInfo: T.Variable = {
      name: varName,
      isConst: true,
      type: 'Unknown',
    };
    scope.variables.set(varName, variableInfo);

    result.expr2 = parseExpr(undefined, { scope });

    // TODO: Remove this when all expressions support returnType
    prevExpr.returnType = (result.expr2 as T.NumberLiteral).returnType;
    variableInfo.type = prevExpr.returnType;
    return result;
  }

  ParserError(`Unhandled expression of type \`${prevExpr.type}\``)
}
