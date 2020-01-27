import * as T from '../types';
import { ParserErrorIf } from './error';

export function parseConditionalExpr(
  curTok: T.Token,
  nextToken: () => T.Token,
  parseExpr: (prevExpr: T.Expr, meta?: any) => T.Expr,

  /* Locked Type means there is already a if condition expression before */
  lockedType?: string,
): [T.Token, T.ConditionalExpr] {
  curTok = nextToken(); // Skip 'if' | 'elif' keyword
  let result: T.ConditionalExpr = { type: 'ConditionalExpr', returnType: lockedType ?? 'Unknown' };

  while (curTok.type !== 'arrow' && curTok.value !== 'then') {
    result.condition = parseExpr(result, { target: 'condition' });
    curTok = nextToken();
    ParserErrorIf(curTok.type === 'newline', 'Expect condition to end followed by arrow `=>` or the `then` keyword');
  }

  ParserErrorIf(result.condition === undefined, 'Expect to resolve a condition');

  // TODO: Change annotation to T.Expr when support all return type
  const condReturnedType = (result.condition as T.BinaryOpExpr).returnType;
  ParserErrorIf(
     condReturnedType !== 'Bool',
    `Expect conditional expression's condition should return \`Bool\` type, instead got: \`${condReturnedType}\``,
  );

  if (curTok.value === 'then') {
    curTok = nextToken(); // Skip 'then' keyword      
    ParserErrorIf(curTok.type !== 'newline', 'Expect no tokens after `then` keyword');
  }

  curTok = nextToken(); // Skip '=>' inline-control operator or skip `newline` if using `then block`

  while (curTok.type !== 'newline') {
    result.expr1 = parseExpr(result, { target: 'expr1' });
    curTok = nextToken();
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

  curTok = nextToken(); // Skip newline

  /* Handle elif is exactly the same as the if expression */
  if (curTok.type === 'keyword' && curTok.value === 'elif') {
    [curTok, result.expr2] = parseConditionalExpr(curTok, nextToken, parseExpr, result.returnType);
    return [curTok, result];
  }

  /* Handle else expression */
  if (curTok.type === 'keyword' && curTok.value === 'else') {
    curTok = nextToken(); // Skip 'else' keyword

    ParserErrorIf(
      curTok.type !== 'arrow' && curTok.value !== 'then',
      'Expect else condition to followed by arrow `=>` or the `then` keyword'
    );

    if (curTok.type === 'arrow') {
      curTok = nextToken(); // Skip 'arrow' keyword

      while (curTok.type !== 'newline') {
        result.expr2 = parseExpr(result, { target: 'expr2' });
        curTok = nextToken();
      }
    } else if (curTok.value === 'then') {
      curTok = nextToken(); // Skip 'then' keyword
      if (curTok.type === 'newline') {
        curTok = nextToken(); // Skip 'newline' token

        while (curTok.type !== 'newline') {
          result.expr2 = parseExpr(result, { target: 'expr2' });
          curTok = nextToken();
        }

        curTok = nextToken(); // Skip 'newline' token
        ParserErrorIf(curTok.value !== 'end', 'Expect `else then` expression to followed by an `end` keyword');

        curTok = nextToken(); // Skip 'end' token
        ParserErrorIf(curTok.type !== 'newline', 'Expect no tokens after `end` keyword');
      }
    }
  }

  ParserErrorIf(
    (result.expr2 as T.StringLiteral).returnType !== result.returnType,
    `Expect values returned from different condition branch to be the same`
  );

  return [curTok, result];
}
