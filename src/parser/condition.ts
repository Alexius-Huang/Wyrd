import * as T from '../types';
import { TokenTracker, DataType as DT } from './utils';
import { ParserErrorIf, ParserError } from './error';
import { EmptyExpression, VoidExpression } from './constants';

export function parseConditionalExpr(
  tt: TokenTracker,
  parseExpr: (prevExpr: T.Expr, meta?: any) => T.Expr,
): T.ConditionalExpr {
  tt.next(); // Skip 'if' | 'elif' keyword
  let result: T.ConditionalExpr = {
    type: 'ConditionalExpr',
    condition: EmptyExpression,
    expr1: EmptyExpression,
    expr2: VoidExpression,
    return: DT.Unknown
  };

  let isThenExpression = false;

  while (tt.isNot('arrow') && tt.valueIsNot('then')) {
    result.condition = parseExpr(result, { target: 'condition' });
    tt.next();
    ParserErrorIf(tt.is('newline'), 'Expect condition to end followed by arrow `=>` or the `then` keyword');
  }

  ParserErrorIf(result.condition === undefined, 'Expect to resolve a condition');

  const condReturnedType = result.condition.return;
  ParserErrorIf(
     condReturnedType.isNotEqualTo(DT.Bool),
    `Expect conditional expression's condition should return \`Bool\` type, instead got: \`${condReturnedType}\``,
  );

  if (tt.valueIs('then')) {
    tt.next(); // Skip 'then' keyword
    isThenExpression = true;
    ParserErrorIf(tt.isNot('newline'), 'Expect no tokens after `then` keyword');
  }

  tt.next(); // Skip '=>' inline-control operator or skip `newline` if using `then block`

  while (tt.isNot('newline')) {
    result.expr1 = parseExpr(result, { target: 'expr1' });
    tt.next();
  }

  result.return = result.expr1.return;

  if (
    /* Without-Else expression and last line condition */
    !tt.hasNext() ||

    /* Without-else-expression condition */
    !(tt.peekIs('keyword') && tt.peekValueIsOneOf('elif', 'else'))
  ) {
    result.return = result.return.toNullable();

    if (isThenExpression && tt.peekIs('keyword') && tt.peekValueIs('end')) 
      tt.next(); // Skip `end` keyword
    return result;
  }

  tt.next(); // Skip `newline`

  /* Handle elif is exactly the same as the if expression */
  if (tt.is('keyword') && tt.valueIs('elif')) {
    result.expr2 = parseConditionalExpr(tt, parseExpr);

    /*
     *  Case when elif-expression has no else expression further,
     *  the overall conditional expression should be converted to maybe types
     */
    if (!result.return.nullable && result.expr2.return.nullable) {
      result.return = result.return.toNullable();
    }

    if (result.return.isNotEqualTo(result.expr2.return))
      ParserError('Expect values returned from different condition branch to be the same');

    return result;
  }

  /* Handle else expression */
  if (tt.is('keyword') && tt.valueIs('else')) {
    tt.next(); // Skip 'else' keyword

    ParserErrorIf(
      tt.isNot('arrow') && tt.valueIsNot('then'),
      'Expect else condition to followed by arrow `=>` or the `then` keyword'
    );

    if (tt.is('arrow')) {
      tt.next(); // Skip 'arrow' keyword

      while (tt.isNot('newline')) {
        result.expr2 = parseExpr(result, { target: 'expr2' });
        tt.next();
      }
    } else if (tt.valueIs('then')) {
      tt.next(); // Skip 'then' keyword
      if (tt.is('newline')) {
        tt.next(); // Skip 'newline' token

        while (tt.isNot('newline')) {
          result.expr2 = parseExpr(result, { target: 'expr2' });
          tt.next();
        }

        tt.next(); // Skip 'newline' token
        ParserErrorIf(tt.valueIsNot('end'), 'Expect `else then` expression to followed by an `end` keyword');

        tt.next(); // Skip 'end' token
        ParserErrorIf(tt.isNot('newline'), 'Expect no tokens after `end` keyword');
      }
    }
  }

  if (result.expr2.return.isNotEqualTo(result.return))
    ParserError(`Expect values returned from different condition branch to be the same`);

  return result;
}
