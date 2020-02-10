import * as T from '../types';
import TokenTracker from './TokenTracker';
import Scope from './Scope';
import { ParserError, ParserErrorIf } from './error';
import { EmptyExpression } from './constants';

export function parseAssignmentExpr(
  tt: TokenTracker,
  parseExpr: (prevExpr?: T.Expr, meta?: any) => T.Expr,
  scope: Scope,
  prevExpr: T.Expr,
): T.Expr {
  tt.next(); // Skip the `eq` token

  if (prevExpr?.type === 'IdentLiteral') {
    // Check if variable is constant and redeclared in the same scope
    const varName = prevExpr.value;
    if (scope.variables.has(varName)) {
      const variableInfo = scope.variables.get(varName) as T.Variable;
      const { isConst } = variableInfo;
      ParserErrorIf(isConst, `Constant \`${varName}\` cannot be reassigned`);

      // Mutable Variable Assignment
      const result: T.VarAssignmentExpr = {
        type: 'VarAssignmentExpr',
        expr1: prevExpr,
        expr2: EmptyExpression,
        returnType: 'Void',
      };

      result.expr2 = parseExpr(undefined, { scope });
      const isInvalid = result.expr2.returnType === 'Invalid';
      const isVoid = result.expr2.returnType === 'Void';
      ParserErrorIf(isInvalid || isVoid, `Expect variable \`${varName}\` not declared as type 'Invalid' or 'Void'`);
      ParserErrorIf(
        variableInfo.type !== result.expr2.returnType,
        `Expect mutable variable \`${varName}\` to assign value of type \`${variableInfo.type}\`, instead got: \`${result.expr2.returnType}\``
      );
      return result;
    }

    // Constant Declaration
    const result: T.AssignmentExpr = {
      type: 'AssignmentExpr',
      expr1: prevExpr,
      expr2: EmptyExpression,
      returnType: 'Void',
    };

    const variableInfo: T.Variable = {
      name: varName,
      isConst: true,
      type: 'Unknown',
    };
    scope.variables.set(varName, variableInfo);

    result.expr2 = parseExpr(undefined, { scope });
    const isInvalid = result.expr2.returnType === 'Invalid';
    const isVoid = result.expr2.returnType === 'Void';
    ParserErrorIf(isInvalid || isVoid, `Expect variable \`${varName}\` not declared as type 'Invalid' or 'Void'`);    

    prevExpr.returnType = result.expr2.returnType;
    variableInfo.type = prevExpr.returnType;
    return result;
  }

  ParserError(`Unhandled expression of type \`${prevExpr.type}\``)
}
