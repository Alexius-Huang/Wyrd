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

  if (scope.isNameOccupied(constName)) {
    if (scope.hasVariable(tt.value)) {
      const varInfo = scope.getVariable(tt.value);
      if (varInfo.isConst)
        ParserError(`\`${constName}\` has already been declared as a constant`);
      ParserError(`\`${constName}\` has already been declared as a variable`);
    }
    ParserError(`\`${constName}\` already been used in this scope`);
  }

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

  const tempAST: T.AST = [];
  if (tt.is('newline'))
    ParserError(`Expect constant \`${constName}\`'s declaration should have value, instead got \`newline\``);

  do {
    const expr = parseExpr(undefined, { scope, ast: tempAST });
    tt.next();
    tempAST.push(expr);    
  } while (tt.isNot('newline'));

  result.expr2 = tempAST[0];
  if (result.expr2.return.isNotAssignableTo(result.expr1.return))
    ParserError(`Expect constant \`${constName}\` to assign value of type \`${result.expr1.return}\`, instead got: \`${result.expr2.return}\``);
  scope.createConstant(constName, dt);
  return result;
}
