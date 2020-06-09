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

  if (scope.isNameOccupied(constName))
    ParserError(`\`${constName}\` already been used in this scope`);

  const dt = typeLiteral.typeObject;
  scope.createConstant(constName, dt);

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
    const expr = parseExpr(tempAST.pop(), { ast: tempAST });
    tt.next();
    tempAST.push(expr);
  } while (tt.isNot('newline'));

  result.expr2 = tempAST[0];
  return result;
}
