import * as T from '../types';
import { TokenTracker, Scope, DataType as DT } from './utils';
import { ParserError, ParserErrorIf } from './error';
import { EmptyExpression } from './constants';

export function parseVarDeclaration(
  tt: TokenTracker,
  parseExpr: T.ExpressionParsingFunction,
  scope: Scope,
): T.Expr {
  tt.next(); // Skip keyword `mutable`

  ParserErrorIf(
    tt.isNot('ident'),
    `Expect next token to be an \`ident\` to represent the mutable variable's name, got ${tt.type}`
  );
  const varName = tt.value;
  checkIfVariableIsAlreadyDeclared(scope, varName);

  tt.next(); // Skip the `ident` token which is the name of the variable

  const result: T.VarDeclaration = {
    type: 'VarDeclaration',
    expr1: { type: 'IdentLiteral', value: varName, return: DT.Invalid },
    expr2: EmptyExpression,
    return: DT.Void
  };

  /* Handle Maybe Types */
  if (tt.is('keyword') && tt.valueIs('maybe'))
    return handleMaybeTypeDeclaration(tt, parseExpr, scope, result);

  ParserErrorIf(tt.isNot('eq'), `Expect next token to be \`eq\`, got ${tt.type}`);
  tt.next(); // Skip the `eq` token

  result.expr2 = parseExpr(undefined, { scope });
  const isInvalid = DT.isInvalid(result.expr2.return);
  const isVoid = DT.isVoid(result.expr2.return);
  ParserErrorIf(isInvalid || isVoid, `Expect variable \`${varName}\` not declared as type 'Invalid' or 'Void'`);

  result.expr1.return = result.expr2.return;
  scope.createMutableVariable(varName, result.expr1.return);

  return result;
}

function checkIfVariableIsAlreadyDeclared(scope: Scope, varName: string): void {
  if (scope.hasVariable(varName)) {
    const varInfo = scope.getVariable(varName);

    if (varInfo.isConst) {
      ParserError(`Constant \`${varName}\` cannot be redeclared as variable`);
    } else {
      ParserError(`Variable \`${varName}\` cannot be redeclared again`);
    }
  }
}

function handleMaybeTypeDeclaration(
  tt: TokenTracker,
  parseExpr: T.ExpressionParsingFunction,
  scope: Scope,
  prevExpr: T.VarDeclaration
): T.VarDeclaration {
  let result = { ...prevExpr };
  const varName = result.expr1.value;
  tt.next(); // Skip the `maybe` keyword

  // TODO: Support list, records or in future, support tuple
  if (tt.isNot('builtin-type'))
    ParserError('Currently Wyrd-Lang only support builtin-types as maybe types');

  result.expr1.return = new DT(tt.value, true);
  scope.createMutableVariable(varName, result.expr1.return);
  tt.next();

  if (tt.is('newline')) {
    result.expr2 = { type: 'NullLiteral', value: 'Null', return: DT.Null };
    return result;
  }

  ParserErrorIf(tt.isNot('eq'), `Expect next token to be \`eq\`, got ${tt.type}`);
  tt.next(); // Skip the `eq` token

  result.expr2 = parseExpr(undefined, { scope });
  const isInvalid = DT.isInvalid(result.expr2.return);
  const isVoid = DT.isVoid(result.expr2.return);
  ParserErrorIf(isInvalid || isVoid, `Expect variable \`${varName}\` not declared as type 'Invalid' or 'Void'`);
  return result;
}
