import * as T from '../../types';
import { TokenTracker, DataType as DT, Scope } from '../utils';
import { ParserErrorIf, ParserError } from '../error';

export function parseCondition(
  tt: TokenTracker,
  parseExpr: T.ExpressionParsingFunction,
  scope: Scope,
  prevExpr: T.ConditionalExpr
): T.ConditionalExpr {
  const result = { ...prevExpr };

  const condBodyAST: T.AST = [];
  while (tt.isNot('arrow') && tt.valueIsNotOneOf('then', 'do')) {
    const expr = parseExpr(undefined, { scope, ast: condBodyAST });
    condBodyAST.push(expr);
    tt.next();
    ParserErrorIf(tt.is('newline'), 'Expect condition to end followed by arrow `=>` or the `then` keyword');
  }
  result.condition = condBodyAST.pop() as T.Expr;

  ParserErrorIf(result.condition === undefined, 'Expect to resolve a condition');

  if (result.condition.return.isNotEqualTo(DT.Bool))
    ParserError(`Expect conditional expression's condition should return \`Bool\` type, instead got: \`${result.condition.return}\``)

  return result;
}
