import * as T from '../../types';
import { TokenTracker, Scope, DataType as DT } from '../utils';
import { ParserErrorIf } from '../error';
import { EmptyExpression } from '../constants';

export function parseRecordValueAssignmentExpr(
  tt: TokenTracker,
  parseExpr: T.ExpressionParsingFunction,
  scope: Scope,
  prevExpr: T.RecordReferenceExpr,
): T.Expr {
  tt.next(); // Skip the `eq` token

  // Check if variable is constant and redeclared in the same scope
  // const varName = prevExpr.value;
  // if (!scope.hasVariable(varName))
  //   ParserError(`\`${varName}\` is undeclared throughout scope`);

  // const varInfo = scope.getVariable(varName);
  // ParserErrorIf(varInfo.isConst, `Constant \`${varName}\` cannot be reassigned`);

  // Mutable Variable Assignment
  const result: T.RecordValueAssignmentExpr = {
    type: 'RecordValueAssignmentExpr',
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
  ParserErrorIf(isInvalid || isVoid, 'Record value assignment received type `Invalid` or `Void`');
  ParserErrorIf(
    !result.expr2.return.isAssignableTo(prevExpr.return),
    `Expect record value to assign value of type \`${prevExpr.return.type}\`, instead got: \`${result.expr2.return}\``
  );
  return result;
}
