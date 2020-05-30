import * as T from '../types';
import { TokenTracker, Scope, DataType as DT, Parameter } from './utils';
import { ParserErrorIf } from './error';
import { parseParameters } from './function/parameters';

export function parseFunctionInvokeExpr(
  tt: TokenTracker,
  parseExpr: T.ExpressionParsingFunction,
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
    result.params = parseParameters(tt, parseExpr, scope);

  const inputParameter = Parameter.from(result.params.map(expr => expr.return));
  const patternInfo = scope.getFunctionPattern(name, inputParameter);
  result.name = patternInfo.name;
  result.return = patternInfo.returnDataType;

  return result;
}
