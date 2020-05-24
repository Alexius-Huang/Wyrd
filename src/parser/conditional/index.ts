import * as T from '../../types';
import { TokenTracker, DataType as DT, Scope } from '../utils';
import { ParserErrorIf, ParserError } from '../error';
import { EmptyExpression, VoidExpression } from '../constants';
import { parseElseIfExpression } from './else-if-expression';
import { parseCondition } from './condition';

export function parseConditionalExpr(
  tt: TokenTracker,
  parseExpr: (prevExpr: T.Expr, meta?: any) => T.Expr,
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

  let isThenExpression = false;
  // let isDoBlockExpression = false;

  if (tt.valueIs('then')) {
    tt.next(); // Skip 'then' keyword
    isThenExpression = true;
    ParserErrorIf(tt.isNot('newline'), 'Expect no tokens after `then` keyword');
  }

  // else if (tt.valueIs('do')) {
  //   tt.next(); // Skip 'do' keyword
  //   isDoBlockExpression = true;
  //   ParserErrorIf(tt.isNot('newline'), 'Expect no tokens after `do` keyword');
  // }

  tt.next(); // Skip '=>' inline-control operator or skip `newline` if using `then` expression or `do` block

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
  if (tt.is('keyword') && tt.valueIs('elif'))
    return parseElseIfExpression(tt, parseExpr, scope, result);

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
