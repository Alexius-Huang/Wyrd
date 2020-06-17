import * as T from '../../types';
import { TokenTracker, Scope, DataType as DT } from '../utils';
import { EmptyExpression } from '../constants';
import { ParserError } from '../error';

export function parseConstantDeclaration(
  tt: TokenTracker,
  parseExpr: T.ExpressionParsingFunction,
  scope: Scope,
  typeLiteral: T.TypeLiteral,
): T.ConstDeclaration {
  const constName = tt.value;

  if (scope.hasVariableInCurrentScope(tt.value)) {
    const varInfo = scope.getVariable(tt.value);
    if (varInfo.isConst)
      ParserError(`\`${constName}\` has already been declared as a constant`);
    ParserError(`\`${constName}\` has already been declared as a variable`);
  }

  // TODO: Throw error if declaring variable of name that occupies function or record name
  // ParserError(`\`${constName}\` already been used in this scope`);

  const dt = typeLiteral.typeObject;
  tt.next(); // Skip `ident`
  tt.next(); // Skip `eq`
  const result: T.ConstDeclaration = {
    type: 'ConstDeclaration',
    expr1: {
      type: 'IdentLiteral',
      value: constName,
      return: dt,
    },
    expr2: EmptyExpression,
    return: DT.Void,
  };

  const constDeclarationAST: T.AST = [];
  if (tt.is('newline'))
    ParserError(`Expect constant \`${constName}\`'s declaration should have value, instead got \`newline\``);

  do {
    const expr = parseExpr(undefined, { scope, ast: constDeclarationAST });
    tt.next();
    constDeclarationAST.push(expr);    
  } while (tt.isNot('newline'));

  result.expr2 = constDeclarationAST.pop() as T.Expr;
  const assignedType = result.expr2.return;
  const isInvalid = DT.isInvalid(assignedType);
  const isVoid = DT.isVoid(assignedType);
  const isNotAssignable = assignedType.isNotAssignableTo(dt);
  if(isInvalid || isVoid || isNotAssignable)
    ParserError(`Expect constant \`${constName}\` to assign value of type \`${dt}\`, instead got: \`${assignedType}\``);

  scope.createConstant(constName, dt);
  return result;
}
