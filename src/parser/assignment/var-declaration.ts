import * as T from '../../types';
import { TokenTracker, Scope, DataType as DT } from '../utils';
import { ParserError, ParserErrorIf } from '../error';
import { EmptyExpression } from '../constants';
import { parseTypeLiteral } from '../type-literal';

export function parseVarDeclaration(
  tt: TokenTracker,
  parseExpr: T.ExpressionParsingFunction,
  scope: Scope,
): T.Expr {
  tt.next(); // Skip keyword `mutable`

  let nullable = false;
  if (tt.is('keyword') && tt.valueIs('maybe')) {
    nullable = true;
    tt.next();
  }

  let varType: DT;
  if (tt.is('builtin-type') || (tt.is('ident') && scope.hasRecord(tt.value))) {
    varType = new DT(tt.value);
  } else if (tt.is('ident')) {
    if (!(scope.hasRecord(tt.value) || scope.hasGenericType(tt.value)))
      ParserError(`Unrecognized type: \`${tt.value}\``);    
    varType = parseTypeLiteral(tt, parseExpr, scope).typeObject;
  } else {
    ParserError(`Expect to type literal in mutable variable declaration, instead got token of type: \`${tt.type}\``);
  }
  tt.next(); // Skip `type`

  if (nullable)
    varType = varType.toNullable();

  if (tt.isNot('ident'))
    ParserError(`Expect to declare mutable variable's name, instead got token of type: \`${tt.type}\``);

  const varName = tt.value;
  checkIfVariableIsAlreadyDeclared(scope, varName);

  tt.next(); // Skip the `ident` token which is the name of the variable
  const result: T.VarDeclaration = {
    type: 'VarDeclaration',
    expr1: { type: 'IdentLiteral', value: varName, return: varType },
    expr2: EmptyExpression,
    return: DT.Void
  };

  // Maybe types without `eq` token in default is assigned with Null
  if (nullable && tt.is('newline')) {
    result.expr2 = { type: 'NullLiteral', value: 'Null', return: DT.Null };
    scope.createMutableVariable(varName, varType);
    return result;
  }

  ParserErrorIf(tt.isNot('eq'), `Expect next token to be \`eq\`, instead got \`${tt.type}\``);
  tt.next(); // Skip the `eq` token

  const varDeclarationAST: T.AST = [];
  if (tt.is('newline'))
    ParserError(`Expect variable \`${varName}\`'s declaration should have value, instead got \`newline\``);

  do {
    const expr = parseExpr(undefined, { scope, ast: varDeclarationAST });
    tt.next();
    varDeclarationAST.push(expr);    
  } while (tt.isNot('newline'));

  result.expr2 = varDeclarationAST.pop() as T.Expr;
  const assignedType = result.expr2.return;
  const isInvalid = DT.isInvalid(assignedType);
  const isVoid = DT.isVoid(assignedType);
  const isNotAssignable = assignedType.isNotAssignableTo(varType);
  if(isInvalid || isVoid || isNotAssignable)
    ParserError(`Expect variable \`${varName}\` to assign value of type \`${varType}\`, instead got: \`${assignedType}\``);

  scope.createMutableVariable(varName, varType);
  return result;
}

function checkIfVariableIsAlreadyDeclared(scope: Scope, varName: string): void {
  if (scope.hasVariableInCurrentScope(varName)) {
    const varInfo = scope.getVariable(varName);

    if (varInfo.isConst) {
      ParserError(`Constant \`${varName}\` cannot be redeclared as variable`);
    } else {
      ParserError(`Variable \`${varName}\` cannot be redeclared again`);
    }
  }
}
