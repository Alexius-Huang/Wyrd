import * as T from '../../types';
import { TokenTracker, Scope, DataType as DT } from '../utils';
import { ParserError, ParserErrorIf } from '../error';

export function parseElseExpression(
  tt: TokenTracker,
  parseExpr: T.ExpressionParsingFunction,
  scope: Scope,
  prevExpr: T.ConditionalExpr,
): T.ConditionalExpr {
  let result = { ...prevExpr };
  tt.next(); // Skip 'else' keyword

  if (tt.is('arrow'))
    result = parseElseArrowExpr(tt, parseExpr, scope, result);
  else if (tt.valueIs('then'))
    result = parseElseThenExpr(tt, parseExpr, scope, result);
  else if (tt.valueIs('do'))
    result = parseElseBlockExpr(tt, parseExpr, scope, result);
  else 
    ParserError('Expect else condition to followed by arrow `=>`, `then` or `do` keyword');

  return result;
}

function parseElseArrowExpr(
  tt: TokenTracker,
  parseExpr: T.ExpressionParsingFunction,
  scope: Scope,
  prevExpr: T.ConditionalExpr,
): T.ConditionalExpr {
  let result = { ...prevExpr };

  tt.next(); // Skip 'arrow' keyword

  if (tt.is('newline'))
    ParserError('Expect non-empty expression after \`arrow\` token');

  const elseBodyScope: Scope = scope.createChildScope('else-body');
  const elseBodyAST: T.AST = [];
  while (true) {
    const expr = parseExpr(undefined, { scope: elseBodyScope, ast: elseBodyAST });
    elseBodyAST.push(expr);
    if (tt.peekIs('newline') || !tt.hasNext()) break;
    tt.next();
  }

  result.expr2 = elseBodyAST.pop() as T.Expr;
  return result;
}

function parseElseThenExpr(
  tt: TokenTracker,
  parseExpr: T.ExpressionParsingFunction,
  scope: Scope,
  prevExpr: T.ConditionalExpr,
): T.ConditionalExpr {
  let result = { ...prevExpr };

  tt.next(); // Skip 'then' keyword
  if (tt.isNot('newline'))
    ParserError('Expect no tokens after `then` keyword');

  tt.next(); // Skip 'newline' token

  const elseBodyScope: Scope = scope.createChildScope('else-body');
  const elseBodyAST: T.AST = [];
  do {
    const expr = parseExpr(undefined, { scope: elseBodyScope, ast: elseBodyAST });
    elseBodyAST.push(expr);
    tt.next();
  } while (tt.isNot('newline'));

  result.expr2 = elseBodyAST.pop() as T.Expr;

  tt.next(); // Skip 'newline' token
  ParserErrorIf(tt.valueIsNot('end'), 'Expect `else then` expression to followed by an `end` keyword');
  ParserErrorIf(!tt.peekIs('newline'), 'Expect no tokens after `end` keyword');
  return result;
}

function parseElseBlockExpr(
  tt: TokenTracker,
  parseExpr: T.ExpressionParsingFunction,
  scope: Scope,
  prevExpr: T.ConditionalExpr,
): T.ConditionalExpr {
  let result = { ...prevExpr };

  tt.next(); // Skip 'do' keyword
  if (tt.isNot('newline'))
    ParserError('Expect no tokens after `do` keyword');

  tt.next(); // Skip 'newline' token

  const blockExpr: T.DoBlockExpr = {
    type: 'DoBlockExpr',
    body: [],
    return: DT.Unknown
  };

  const doBlockScope = scope.createChildScope('if-conditional-block');
  while (!(tt.is('keyword') && tt.valueIs('end'))) {
    if (tt.isNot('newline')) {
      const expr = parseExpr(undefined, { ast: blockExpr.body, scope: doBlockScope });
      expr.type !== 'VoidExpr' && blockExpr.body.push(expr);
    }

    tt.next();
  }

  if (blockExpr.body.length === 0)
    ParserError('Do-Block Expression cannot be blank');
  blockExpr.return = blockExpr.body[blockExpr.body.length - 1].return;
  result.expr2 = blockExpr;
  return result;
}
