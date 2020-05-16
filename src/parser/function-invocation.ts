import * as T from '../types';
import { TokenTracker, Scope, DataType as DT, Parameter } from './classes';
import { ParserErrorIf, ParserError } from './error';

export function parseFunctionInvokeExpr(
  tt: TokenTracker,
  parseExpr: (prevExpr?: T.Expr, meta?: any) => T.Expr,
  scope: Scope,
  prevExpr?: T.Expr,
): T.FunctionInvokeExpr {
  const name = tt.value;

  const result: T.FunctionInvokeExpr = {
    type: 'FunctionInvokeExpr',
    name: '',
    params: [],
    return: DT.Unknown,
  };

  tt.next(); // Skip the name of the function
  
  ParserErrorIf(tt.isNot('lparen'), `Expect function \`${name}\` invocation should follow with token \`lparen\``);

  tt.next(); // Skip the left parentheses

  ParserErrorIf(tt.is('comma'), `Expect next token is an expression as parameter of function \`${name}\`, instead got \`comma\``);

  if (tt.isNot('rparen'))
    result.params = parseFunctionParameters(tt, parseExpr, scope);

  const inputParameter = Parameter.from(result.params.map(expr => expr.return));
  const patternInfo = scope.getFunctionPattern(name, inputParameter);  
  if (patternInfo === undefined) {
    ParserError(`Function \`${name}\` is called with unmatched input pattern \`${inputParameter}\``);
  }
  result.name = patternInfo.name;
  result.return = patternInfo.returnDataType;

  return result;
}

function parseFunctionParameters(
  tt: TokenTracker,
  parseExpr: (prevExpr?: T.Expr, meta?: any) => T.Expr,
  scope: Scope,
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
