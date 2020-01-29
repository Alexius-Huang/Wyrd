import * as T from '../types';
import TokenTracker from './TokenTracker';
import { ParserErrorIf } from './error';

export function parseConditionalExpr(
  tt: TokenTracker,
  parseExpr: (prevExpr: T.Expr, meta?: any) => T.Expr,

  /* Locked Type means there is already a if condition expression before */
  lockedType?: string,
): T.ConditionalExpr {
  tt.next(); // Skip 'if' | 'elif' keyword
  let result: T.ConditionalExpr = { type: 'ConditionalExpr', returnType: lockedType ?? 'Unknown' };

  while (tt.isNot('arrow') && tt.current.value !== 'then') {
    result.condition = parseExpr(result, { target: 'condition' });
    tt.next();
    ParserErrorIf(tt.is('newline'), 'Expect condition to end followed by arrow `=>` or the `then` keyword');
  }

  ParserErrorIf(result.condition === undefined, 'Expect to resolve a condition');

  // TODO: Change annotation to T.Expr when support all return type
  const condReturnedType = (result.condition as T.BinaryOpExpr).returnType;
  ParserErrorIf(
     condReturnedType !== 'Bool',
    `Expect conditional expression's condition should return \`Bool\` type, instead got: \`${condReturnedType}\``,
  );

  if (tt.current.value === 'then') {
    tt.next(); // Skip 'then' keyword      
    ParserErrorIf(tt.isNot('newline'), 'Expect no tokens after `then` keyword');
  }

  tt.next(); // Skip '=>' inline-control operator or skip `newline` if using `then block`

  while (!tt.is('newline')) {
    result.expr1 = parseExpr(result, { target: 'expr1' });
    tt.next();
  }

  // TODO: Remove annotation when support returnType
  if (lockedType === undefined) {
    result.returnType = (result.expr1 as T.StringLiteral).returnType;
  } else {
    ParserErrorIf(
      (result.expr1 as T.StringLiteral).returnType !== result.returnType,
      `Expect values returned from different condition branch to be the same`
    );
  }

  tt.next(); // Skip newline

  /* Handle elif is exactly the same as the if expression */
  if (tt.is('keyword') && tt.current.value === 'elif') {
    result.expr2 = parseConditionalExpr(tt, parseExpr, result.returnType);
    return result;
  }

  /* Handle else expression */
  if (tt.is('keyword') && tt.current.value === 'else') {
    tt.next(); // Skip 'else' keyword

    ParserErrorIf(
      tt.isNot('arrow') && tt.current.value as string !== 'then',
      'Expect else condition to followed by arrow `=>` or the `then` keyword'
    );

    if (tt.is('arrow')) {
      tt.next(); // Skip 'arrow' keyword

      while (tt.isNot('newline')) {
        result.expr2 = parseExpr(result, { target: 'expr2' });
        tt.next();
      }
    } else if (tt.current.value as string === 'then') {
      tt.next(); // Skip 'then' keyword
      if (tt.is('newline')) {
        tt.next(); // Skip 'newline' token

        while (tt.isNot('newline')) {
          result.expr2 = parseExpr(result, { target: 'expr2' });
          tt.next();
        }

        tt.next(); // Skip 'newline' token
        ParserErrorIf(tt.current.value as string !== 'end', 'Expect `else then` expression to followed by an `end` keyword');

        tt.next(); // Skip 'end' token
        ParserErrorIf(tt.isNot('newline'), 'Expect no tokens after `end` keyword');
      }
    }
  }

  ParserErrorIf(
    (result.expr2 as T.StringLiteral).returnType !== result.returnType,
    `Expect values returned from different condition branch to be the same`
  );

  return result;
}
