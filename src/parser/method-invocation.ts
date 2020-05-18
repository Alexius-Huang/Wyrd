import * as T from '../types';
import { TokenTracker, Scope, Parameter, DataType as DT } from './utils';
import { ParserErrorIf, ParserError } from './error';
import { EmptyExpression } from './constants';

export function parseMethodInvokeExpr(
  tt: TokenTracker,
  parseExpr: (orevExpr?: T.Expr, meta?: any) => T.Expr,
  scope: Scope,
  prevExpr: T.Expr,
): T.Expr {
  tt.next(); // Skip the `dot` token

  ParserErrorIf(tt.isNot('ident'), `Expect method invoke with token of type \`identifier\`, got token of type \`${tt.type}\``);

  if (prevExpr.type === 'TypeLiteral')
    return parseTypeMethodInvokeExpr(tt, parseExpr, scope, prevExpr);

  return parseValueMethodInvokeExpr(tt, parseExpr, scope, prevExpr);
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
function parseValueMethodInvokeExpr(
  tt: TokenTracker,
  parseExpr: (orevExpr?: T.Expr, meta?: any) => T.Expr,
  scope: Scope,
  prevExpr: T.Expr,
): T.Expr {
  const name = tt.value;
  const result: T.MethodInvokeExpr = {
    type: 'MethodInvokeExpr',
    name: 'UNDECIDED',
    receiver: prevExpr,
    params: [],
    return: DT.Invalid,
  };

  tt.next(); // Skip the name of the method

  ParserErrorIf(tt.isNot('lparen'), `Expect method \`${name}\` invocation should follow with token \`lparen\``);
  tt.next(); // Skip the left parentheses

  ParserErrorIf(tt.is('comma'), `Expect next token is an expression as parameter of function \`${name}\`, instead got \`comma\``);

  if (tt.isNot('rparen'))
    result.params = parseMethodInvokeParameters(tt, parseExpr, scope);

  // Strip down the prioritized layer since the receiver will always be a single node
  if (result.receiver.type === 'PrioritizedExpr')
    result.receiver = result.receiver.expr;

  const receiverType = prevExpr.return;

  if (scope.hasMethod(receiverType, name)) {
    const parameter = Parameter.from(result.params.map(expr => expr.return));
    const methodPattern = scope.getMethodPattern(receiverType, name, parameter);
    if (methodPattern === undefined)
      ParserError(`Method for ${receiverType}.${name} with input pattern \`${parameter}\` doesn't exist`);

    result.name = methodPattern.name;
    result.return = methodPattern.returnDataType;
  }

  return result;
}

/**
 *  Invoke method via type, for instance: Num.toStr(123)
 *  is equivalent to: 123.toStr()
 */
function parseTypeMethodInvokeExpr(
  tt: TokenTracker,
  parseExpr: (orevExpr?: T.Expr, meta?: any) => T.Expr,
  scope: Scope,
  prevExpr: T.TypeLiteral,
): T.Expr {
  const name = tt.value;
  const result: T.MethodInvokeExpr = {
    type: 'MethodInvokeExpr',
    name: 'UNDECIDED',
    receiver: EmptyExpression,
    params: [],
    return: DT.Invalid,
  };
  const receiverType = new DT(prevExpr.value);

  tt.next(); // Skip the name of the method
  
  ParserErrorIf(tt.isNot('lparen'), `Expect method \`${name}\` invocation should follow with token \`lparen\``);
  tt.next(); // Skip the left parentheses

  ParserErrorIf(tt.is('comma'), `Expect next token is an expression as parameter of function \`${name}\`, instead got \`comma\``);

  if (tt.isNot('rparen'))
    result.params = parseMethodInvokeParameters(tt, parseExpr, scope);

  const methodName = `${receiverType}.${name}`;
  ParserErrorIf(
    result.params.length === 0,
    `Expect \`${methodName}\` to have parameter as receiver of type \`${receiverType}\``
  );

  /* Check if receiver as parameter matches the correct type */
  result.receiver = result.params.shift() as T.Expr;
  ParserErrorIf(
    result.receiver.return.isNotEqualTo(receiverType),
    `Expect \`${methodName}\` to have receiver of type \`${receiverType}\`, instead got \`${result.receiver.return}\``
  );

  if (scope.hasMethod(receiverType, name)) {
    const parameter = Parameter.from(result.params.map(expr => expr.return));
    const methodPattern = scope.getMethodPattern(receiverType, name, parameter);
    if (methodPattern === undefined)
      ParserError(`Method for ${receiverType}.${name} with input pattern \`${parameter}\` doesn't exist`);

    result.name = methodPattern.name;
    result.return = methodPattern.returnDataType;
  }

  return result;
}
