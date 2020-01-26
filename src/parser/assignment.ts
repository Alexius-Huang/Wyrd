import * as T from '../types';
import { ParserError, ParserErrorIf } from './error';

export function parseAssignmentExpr(
  curTok: T.Token,
  nextToken: () => T.Token,
  parseExpr: (prevExpr?: T.Expr) => T.Expr,
  scope: T.Scope,
  prevExpr: T.Expr,
): [T.Token, T.Expr] {
  curTok = nextToken(); // Skip the eq token
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

    scope.variables.set(varName, {
      name: varName,
      isConst: true,
      type: 'Unknown',
    });

    result.expr2 = parseExpr();
    return [curTok, result];
  }

  /* Varaible declared in function */
  if (prevExpr?.type === 'FunctionDeclaration') {
    const result: T.AssignmentExpr = {
      type: 'AssignmentExpr',
      expr1: prevExpr.body.pop() as T.Expr,
    };

    result.expr2 = parseExpr(result);
    prevExpr.body.push(result);
    return [curTok, prevExpr];
  }

  ParserError(`Unhandled expression of type \`${prevExpr.type}\``)
}
