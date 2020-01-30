import * as T from '../types';
import TokenTracker from './TokenTracker';
import { ParserErrorIf } from './error';

export function parseFunctionInvokeExpr(
  tt: TokenTracker,
  parseExpr: (prevExpr?: T.Expr, meta?: any) => T.Expr,
  scope: T.Scope,
  prevExpr?: T.Expr,
): T.FunctionInvokeExpr {
  const { functions } = scope;
  const { name, patterns } = functions.get(tt.value) as T.FunctionPattern;

  const result: T.FunctionInvokeExpr = {
    type: 'FunctionInvokeExpr',
    name,
    params: [],
    returnType: 'Unknown',
  };

  tt.next(); // Skip the name of the function

  const hasParenthesesNested = tt.is('lparen');
  if (hasParenthesesNested)
    tt.next(); // Skip the left parentheses

  ParserErrorIf(tt.is('comma'), `Expect next token is an expression as parameter of function \`${name}\`, instead got \`comma\``);

  const prevExprIsPrioritized = prevExpr?.type === 'PrioritizedExpr';

  while (true) {
    let parameterExpr: T.Expr;
    parameterExpr = parseFunctionParameter(
      tt, parseExpr, scope,
      hasParenthesesNested || prevExprIsPrioritized
    );
    result.params.push(parameterExpr);

    if (prevExprIsPrioritized && tt.is('rparen')) break;
    if (hasParenthesesNested && tt.is('rparen')) break;
    if (tt.is('newline')) break;

    tt.next();
  }

  const inputParamsTypePattern = result.params
    .map(expr => expr.returnType)
    .join('.');
  const inputParamsTypeSymbol = Symbol.for(inputParamsTypePattern);

  ParserErrorIf(
    !patterns.has(inputParamsTypeSymbol),
    `Function \`${name}\` is called with unmatched input pattern \`${inputParamsTypePattern}\``
  );

  const patternInfo = patterns.get(inputParamsTypeSymbol) as T.FunctionPatternInfo;
  result.returnType = patternInfo.returnType;

  return result;
}

function parseFunctionParameter(
  tt: TokenTracker,
  parseExpr: (prevExpr?: T.Expr, meta?: any) => T.Expr,
  scope: T.Scope,
  haltByRParen: boolean,
): T.Expr {
  const parameterExpr: T.AST = [];
  let expr: T.Expr | undefined;

  while (tt.isNotOneOf('newline', 'comma')) {
    expr = parseExpr(expr, { scope, ast: parameterExpr });
    parameterExpr.push(expr);

    // TODO: Provide proper description about this line
    //       In abstract, whenever occur line breaks or comma, the argument is parsed complete
    if (tt.isOneOf('newline', 'comma')) break;

    tt.next();
    if (haltByRParen && tt.is('rparen')) break;
  }

  let [result] = parameterExpr;
  return result;
}
