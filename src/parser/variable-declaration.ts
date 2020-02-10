import * as T from '../types';
import TokenTracker from './TokenTracker';
import Scope from './Scope';
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
  const { variables } = scope;
  if (variables.has(varName)) {
    const varInfo = variables.get(varName) as T.Variable;

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
    expr1: { type: 'IdentLiteral', value: varName, returnType: 'Invalid' },
    expr2: EmptyExpression,
    returnType: 'Void'
  };

  result.expr2 = parseExpr(undefined, { scope });
  const isInvalid = result.expr2.returnType === 'Invalid';
  const isVoid = result.expr2.returnType === 'Void';
  ParserErrorIf(isInvalid || isVoid, `Expect variable \`${varName}\` not declared as type 'Invalid' or 'Void'`);

  result.expr1.returnType = result.expr2.returnType;
  scope.createMutableVariable(varName, result.expr1.returnType);

  return result;
}
