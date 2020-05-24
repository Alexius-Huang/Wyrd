import * as T from '../../types';
import { TokenTracker, DataType as DT, Scope } from '../utils';
import { parseCondition } from './condition';
import { parseIfArrowExpr, parseIfThenExpr, parseIfBlockExpr } from './if-expression';
import { parseElseIfExpression } from './if-else-if-expression';
import { parseElseExpression } from './else-expression';
import { EmptyExpression, VoidExpression } from '../constants';
import { ParserError } from '../error';

export function parseConditionalExpr(
  tt: TokenTracker,
  parseExpr: T.ExpressionParsingFunction,
  scope: Scope,
): T.ConditionalExpr {
  let result: T.ConditionalExpr = {
    type: 'ConditionalExpr',
    condition: EmptyExpression,
    expr1: EmptyExpression,
    expr2: VoidExpression,
    return: DT.Unknown
  };

  tt.next(); // Skip 'if' | 'elif' keyword
  result = parseCondition(tt, parseExpr, result);

  let expressionType: 'arrow' | 'then' | 'do-block';
  if (tt.is('arrow')) {
    result = parseIfArrowExpr(tt, parseExpr, scope, result);
    expressionType = 'arrow';
  } else if (tt.valueIs('then')) {
    result = parseIfThenExpr(tt, parseExpr, scope, result);
    expressionType = 'then';
  } else if (tt.valueIs('do')) {
    result = parseIfBlockExpr(tt, parseExpr, scope, result);
    expressionType = 'do-block';
  } else ParserError(`Unhandled conditional expression parsing with token of type \`${tt.type}\``);

  if (
    /* Without-Else expression and last line condition */
    !tt.hasNext() ||

    /* Without-else-expression condition */
    !(tt.peekIs('keyword') && tt.peekValueIsOneOf('elif', 'else'))
  ) {
    result.return = result.return.toNullable();

    if (expressionType !== 'arrow' && tt.peekIs('keyword') && tt.peekValueIs('end'))
      tt.next(); // Skip `end` keyword
    return result;
  }

  tt.next(); // Skip `newline`

  if (tt.is('keyword') && tt.valueIs('elif'))
    return parseElseIfExpression(tt, parseExpr, scope, result);

  if (tt.is('keyword') && tt.valueIs('else'))
    result = parseElseExpression(tt, parseExpr, scope, result);

  if (result.expr2.return.isNotEqualTo(result.return))
    ParserError(`Expect values returned from different condition branch to be the same`);

  return result;
}
