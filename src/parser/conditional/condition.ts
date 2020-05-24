import * as T from '../../types';
import { TokenTracker, DataType as DT } from '../utils';
import { ParserErrorIf, ParserError } from '../error';

export function parseCondition(
  tt: TokenTracker,
  parseExpr: (prevExpr: T.Expr, meta?: any) => T.Expr,
  prevExpr: T.ConditionalExpr
): T.ConditionalExpr {
  const result = { ...prevExpr };

  while (tt.isNot('arrow') && tt.valueIsNotOneOf('then', 'do')) {
    result.condition = parseExpr(result, { target: 'condition' });
    tt.next();
    ParserErrorIf(tt.is('newline'), 'Expect condition to end followed by arrow `=>` or the `then` keyword');
  }

  ParserErrorIf(result.condition === undefined, 'Expect to resolve a condition');

  if (result.condition.return.isNotEqualTo(DT.Bool))
    ParserError(`Expect conditional expression's condition should return \`Bool\` type, instead got: \`${result.condition.return}\``)

  return result;
}
