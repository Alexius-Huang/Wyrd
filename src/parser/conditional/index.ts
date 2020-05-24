import * as T from '../../types';
import { TokenTracker, DataType as DT, Scope } from '../utils';
import { ParserError } from '../error';
import { EmptyExpression, VoidExpression } from '../constants';
import { parsePrimaryArrowExpr } from './arrow-expression';
import { parseCondition } from './condition';
import { parsePrimaryThenExpr } from './then-expression';

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

  if (tt.valueIs('then'))
    return parsePrimaryThenExpr(tt, parseExpr, scope, result);

  // else if (tt.valueIs('do')) {
  //   tt.next(); // Skip 'do' keyword
  //   ParserErrorIf(tt.isNot('newline'), 'Expect no tokens after `do` keyword');
  // }

  else if (tt.is('arrow'))
    return parsePrimaryArrowExpr(tt, parseExpr, scope, result);
  else
    ParserError(`Unhandled conditional expression parsing with token of type \`${tt.type}\``);
}
