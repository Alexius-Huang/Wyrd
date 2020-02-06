import * as T from "../types";
import TokenTracker from './TokenTracker';
import { ParserErrorIf, ParserError } from './error';
import { BuiltinPrimitiveMethods } from './constants';

export function parseMethodInvokeExpr(
  tt: TokenTracker,
  parseExpr: (orevExpr?: T.Expr, meta?: any) => T.Expr,
  scope: T.Scope,
  prevExpr: T.Expr,
): T.Expr {    
  tt.next(); // Skip the `dot` token

  ParserErrorIf(tt.isNot('ident'), `Expect method invoke with token of type \`identifier\`, got token of type \`${tt.type}\``);
  
  const name = tt.value;
  const result: T.MethodInvokeExpr = {
    type: 'MethodInvokeExpr',
    name,
    receiver: prevExpr,
    params: [],
    returnType: 'Invalid',
  };

  const receiverType = prevExpr.returnType;

  // TODO: Currently only support primitive type of data, future support
  //       for custom type data
  const builtinMethods = BuiltinPrimitiveMethods.get(receiverType) as Map<string, T.MethodPattern>;
  let isBuiltinMethod = false;
  let builtinMethodPattern: T.MethodPattern | null = null;
  if (builtinMethods.has(name)) {
    builtinMethodPattern = builtinMethods.get(name) as T.MethodPattern;
    isBuiltinMethod = true;
  } else {
    ParserError('Unhandled method invocation');
  }

  tt.next(); // Skip the name of the method
  
  ParserErrorIf(tt.isNot('lparen'), `Expect method \`${name}\` invocation should follow with token \`lparen\``);

  tt.next(); // Skip the left parentheses

  ParserErrorIf(tt.is('comma'), `Expect next token is an expression as parameter of function \`${name}\`, instead got \`comma\``);

  if (tt.isNot('rparen'))
    result.params = parseMethodInvokeParameters(tt, parseExpr, scope);

  /* Input pattern validation */
  const inputParamsTypePattern = result.params
    .map(expr => expr.returnType)
    .join('.');

  if (isBuiltinMethod) {
    const { inputPattern, returnType } = builtinMethodPattern;
    ParserErrorIf(
      inputParamsTypePattern !== inputPattern,
      `Expect ${receiverType}.${name} to receive input pattern of \`${inputPattern}\`, instead got: \`${inputParamsTypePattern}\``
    );

    result.returnType = returnType;
  }

  return result;
}

function parseMethodInvokeParameters(
  tt: TokenTracker,
  parseExpr: (prevExpr?: T.Expr, meta?: any) => T.Expr,
  scope: T.Scope,
): Array<T.Expr> {
  const params: Array<T.Expr> = [];

  while (true) {
    let parameterExpr: T.Expr;
    parameterExpr = parseMethodInvokeParameter(tt, parseExpr, scope);
    params.push(parameterExpr);

    if (tt.isOneOf('rparen', 'newline')) break;
    tt.next();
  }

  return params;
}

function parseMethodInvokeParameter(
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
