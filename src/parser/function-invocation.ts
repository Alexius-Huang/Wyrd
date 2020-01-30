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
  while (true) {
    let parameterExpr: T.Expr;
    parameterExpr = parseFunctionParameter(tt, parseExpr, scope, hasParenthesesNested);
    result.params.push(parameterExpr);

    if (hasParenthesesNested && tt.is('rparen')) break;
    if (tt.is('newline')) break;

    tt.next();
  }

  // TODO: remove type annotation when all expression support return type
  const inputParamsTypePattern = result.params
    .map(expr => (expr as T.NumberLiteral).returnType)
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
  hasParenthesesNested: boolean,
): T.Expr {
  const parameterExpr: T.AST = [];

  while (tt.isNotOneOf('newline', 'comma')) {

    const expr = parseExpr(undefined, { scope, ast: parameterExpr });
    parameterExpr.push(expr);

    if (expr.type !== 'FunctionInvokeExpr') {
      tt.next();

      if (hasParenthesesNested && tt.is('rparen')) break;
    } else {
      // If the previous expression is function invoke expression
      // It'll end with either comma or newline already, so we need to update the current token
      // TODO: After implement token tracter, this may be able to refactor
      // curTok = currentToken();
    }
  }

  return parameterExpr[0];
}
