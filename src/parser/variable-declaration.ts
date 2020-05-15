import * as T from '../types';
import { TokenTracker, Scope, DataType as DT } from './classes';
import { ParserError, ParserErrorIf } from './error';
import { EmptyExpression } from './constants';

export function parseVarDeclaration(
  tt: TokenTracker,
  parseExpr: (prevExpr?: T.Expr, meta?: any) => T.Expr,
  scope: Scope,
): T.Expr {
  tt.next(); // Skip keyword `mutable`

  ParserErrorIf(
    tt.isNot('ident'),
    `Expect next token to be an \`ident\` to represent the mutable variable's name, got ${tt.type}`
  );
  const varName = tt.value;

  // Check if variable is redeclared before in the current scope
  if (scope.hasVariable(varName)) {
    const varInfo = scope.getVariable(varName);

    if (varInfo.isConst) {
      ParserError(`Constant \`${varName}\` cannot be redeclared as variable`);
    } else {
      ParserError(`Variable \`${varName}\` cannot be redeclared again`);
    }
  }

  tt.next(); // Skip the `ident` token which is the name of the variable

  ParserErrorIf(
    tt.isNot('eq'),
    `Expect next token to be \`eq\`, got ${tt.type}`
  );
  tt.next(); // Skip the `eq` token

  const result: T.VarDeclaration = {
    type: 'VarDeclaration',
    expr1: { type: 'IdentLiteral', value: varName, return: DT.Invalid },
    expr2: EmptyExpression,
    return: DT.Void
  };

  result.expr2 = parseExpr(undefined, { scope });
  const isInvalid = DT.isInvalid(result.expr2.return);
  const isVoid = DT.isVoid(result.expr2.return);
  ParserErrorIf(isInvalid || isVoid, `Expect variable \`${varName}\` not declared as type 'Invalid' or 'Void'`);

  result.expr1.return = result.expr2.return;
  scope.createMutableVariable(varName, result.expr1.return);

  return result;
}
