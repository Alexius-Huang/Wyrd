import * as T from '../../types';
import { TokenTracker, Scope, DataType as DT } from '../utils';
import { ParserError, ParserErrorIf } from '../error';
import { EmptyExpression } from '../constants';

export function parseVarAssignmentExpr(
  tt: TokenTracker,
  parseExpr: T.ExpressionParsingFunction,
  scope: Scope,
  prevExpr: T.IdentLiteral,
): T.Expr {
  tt.next(); // Skip the `eq` token

  // Check if variable is constant and redeclared in the same scope
  const varName = prevExpr.value;
  if (!scope.hasVariable(varName))
    ParserError(`\`${varName}\` is undeclared throughout scope`);

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
