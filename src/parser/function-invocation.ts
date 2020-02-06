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
  
  ParserErrorIf(tt.isNot('lparen'), `Expect function \`${name}\` invocation should follow with token \`lparen\``);

  tt.next(); // Skip the left parentheses

  ParserErrorIf(tt.is('comma'), `Expect next token is an expression as parameter of function \`${name}\`, instead got \`comma\``);

  if (tt.isNot('rparen'))
    result.params = parseFunctionParameters(tt, parseExpr, scope);

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

function parseFunctionParameters(
  tt: TokenTracker,
  parseExpr: (prevExpr?: T.Expr, meta?: any) => T.Expr,
  scope: T.Scope,
): Array<T.Expr> {
  const params: Array<T.Expr> = [];

  while (true) {
    let parameterExpr: T.Expr;
    parameterExpr = parseFunctionParameter(tt, parseExpr, scope);
    params.push(parameterExpr);

    if (tt.isOneOf('rparen', 'newline')) break;
    tt.next();
  }

  return params;
}

function parseFunctionParameter(
  tt: TokenTracker,
  parseExpr: (prevExpr?: T.Expr, meta?: any) => T.Expr,
  scope: T.Scope,
): T.Expr {
  const parameterExpr: T.AST = [];
  let expr: T.Expr | undefined;

  while (tt.isNotOneOf('newline', 'comma', 'rparen')) {
    expr = parseExpr(undefined, { scope, ast: parameterExpr });
    parameterExpr.push(expr);
    tt.next();
  }

  let [result] = parameterExpr;
  return result;
}
