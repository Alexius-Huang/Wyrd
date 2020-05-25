import * as T from '../types';
import { TokenTracker, Scope, DataType as DT } from './utils';
import { ParserError, ParserErrorIf } from './error';
import { EmptyExpression } from './constants';

export function parseAssignmentExpr(
  tt: TokenTracker,
  parseExpr: T.ExpressionParsingFunction,
  scope: Scope,
  prevExpr: T.Expr,
): T.Expr {
  tt.next(); // Skip the `eq` token

  if (prevExpr?.type === 'IdentLiteral') {
    // Check if variable is constant and redeclared in the same scope
    const varName = prevExpr.value;
    if (scope.hasVariable(varName)) {
      const varInfo = scope.getVariable(varName);
      ParserErrorIf(varInfo.isConst, `Constant \`${varName}\` cannot be reassigned`);

      // Mutable Variable Assignment
      const result: T.VarAssignmentExpr = {
        type: 'VarAssignmentExpr',
        expr1: prevExpr,
        expr2: EmptyExpression,
        return: DT.Void,
      };

      const subAST: T.AST = [];
      while (tt.isNot('newline')) {
        const expr = parseExpr(undefined, { scope, ast: subAST });
        subAST.push(expr);
        if (tt.is('newline') || !tt.hasNext()) break;
        tt.next();
      }
      result.expr2 = subAST.pop() as T.Expr;
      const isInvalid = DT.isInvalid(result.expr2.return);
      const isVoid = DT.isVoid(result.expr2.return);
      ParserErrorIf(isInvalid || isVoid, `Expect variable \`${varName}\` not declared as type 'Invalid' or 'Void'`);
      ParserErrorIf(
        !result.expr2.return.isAssignableTo(varInfo.type),
        `Expect mutable variable \`${varName}\` to assign value of type \`${varInfo.type}\`, instead got: \`${result.expr2.return}\``
      );
      return result;
    }

    // Constant Declaration
    const result: T.AssignmentExpr = {
      type: 'AssignmentExpr',
      expr1: prevExpr,
      expr2: EmptyExpression,
      return: DT.Void,
    };

    const varInfo = scope.createConstant(varName);

    const subAST: T.AST = [];
    while (tt.isNot('newline')) {
      const expr = parseExpr(undefined, { scope, ast: subAST });
      subAST.push(expr);
      if (tt.is('newline') || !tt.hasNext()) break;
      tt.next();
    }
    result.expr2 = subAST.pop() as T.Expr;
    const isInvalid = DT.isInvalid(result.expr2.return);
    const isVoid = DT.isVoid(result.expr2.return);
    ParserErrorIf(isInvalid || isVoid, `Expect variable \`${varName}\` not declared as type 'Invalid' or 'Void'`);    

    prevExpr.return = result.expr2.return;
    varInfo.type = prevExpr.return;
    return result;
  }

  ParserError(`Unhandled expression of type \`${prevExpr.type}\``)
}
