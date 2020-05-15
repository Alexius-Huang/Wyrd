import * as T from '../types';
import { TokenTracker, Scope, Parameter, DataType as DT } from './classes';
import { ParserErrorIf, ParserError } from './error';
import { BuiltinPrimitiveMethods, EmptyExpression } from './constants';

export function parseMethodInvokeExpr(
  tt: TokenTracker,
  parseExpr: (orevExpr?: T.Expr, meta?: any) => T.Expr,
  scope: Scope,
  prevExpr: T.Expr,
): T.Expr {
  tt.next(); // Skip the `dot` token

  ParserErrorIf(tt.isNot('ident'), `Expect method invoke with token of type \`identifier\`, got token of type \`${tt.type}\``);

  if (prevExpr.type === 'TypeLiteral')
    return parseBuiltinTypeMethodInvokeExpr(tt, parseExpr, scope, prevExpr);

  return parseBasicMethodInvokeExpr(tt, parseExpr, scope, prevExpr);
}

function parseMethodInvokeParameters(
  tt: TokenTracker,
  parseExpr: (prevExpr?: T.Expr, meta?: any) => T.Expr,
  scope: Scope,
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
  scope: Scope,
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

/**
 *  Basic case of invoking method from values, for instance: 123.toStr()
 */
function parseBasicMethodInvokeExpr(
  tt: TokenTracker,
  parseExpr: (orevExpr?: T.Expr, meta?: any) => T.Expr,
  scope: Scope,
  prevExpr: T.Expr,
): T.Expr {
  const name = tt.value;
  const result: T.MethodInvokeExpr = {
    type: 'MethodInvokeExpr',
    name,
    receiver: prevExpr,
    params: [],
    return: DT.Invalid,
  };

  // Strip down the prioritized layer since the receiver will always be a single node
  if (result.receiver.type === 'PrioritizedExpr')
    result.receiver = result.receiver.expr;

  const receiverType = prevExpr.return;

  // TODO: Currently only support primitive type of data, future support
  //       for custom type data
  const builtinMethods = BuiltinPrimitiveMethods.get(receiverType.type) as Map<string, T.MethodPattern>;
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
  const inputParamsTypePattern = Parameter.from(result.params.map(expr => expr.return));

  if (isBuiltinMethod) {
    const { parameter, return: r } = builtinMethodPattern;
    ParserErrorIf(
      !inputParamsTypePattern.matches(parameter),
      `Expect ${receiverType}.${name} to receive input pattern of \`${parameter}\`, instead got: \`${inputParamsTypePattern}\``
    );

    result.return = r;
  }

  return result;
}

/**
 *  Invoke method via type, for instance: Num.toStr(123)
 *  is equivalent to: 123.toStr()
 */
function parseBuiltinTypeMethodInvokeExpr(
  tt: TokenTracker,
  parseExpr: (orevExpr?: T.Expr, meta?: any) => T.Expr,
  scope: Scope,
  prevExpr: T.TypeLiteral,
): T.Expr {
  const name = tt.value;
  const result: T.MethodInvokeExpr = {
    type: 'MethodInvokeExpr',
    name,
    receiver: EmptyExpression,
    params: [],
    return: DT.Invalid,
  };

  const receiver = new DT(prevExpr.value);

  // TODO: Currently only support primitive type of data, future support
  //       for custom type data
  const builtinMethods = BuiltinPrimitiveMethods.get(receiver.type) as Map<string, T.MethodPattern>;
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

  const methodName = `${receiver}.${name}`;
  ParserErrorIf(
    result.params.length === 0,
    `Expect \`${methodName}\` to have parameter as receiver of type \`${receiver}\``
  );
  const receiverParam = result.params.shift() as T.Expr;
  result.receiver = receiverParam;

  ParserErrorIf(
    result.receiver.return.isNotEqualTo(receiver),
    `Expect \`${methodName}\` to have receiver of type \`${receiver}\`, instead got \`${result.receiver.return}\``
  );

  /* Input pattern validation */
  const inputParamsTypePattern = Parameter.from(result.params.map(expr => expr.return));

  if (isBuiltinMethod) {
    const { parameter, return: r } = builtinMethodPattern;
    ParserErrorIf(
      !inputParamsTypePattern.matches(parameter),
      `Expect ${receiver}.${name} to receive input pattern of \`${parameter}\`, instead got: \`${inputParamsTypePattern}\``
    );

    result.return = r;
  }

  return result;
}
