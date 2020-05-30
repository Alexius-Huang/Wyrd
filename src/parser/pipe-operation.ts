import * as T from '../types';
import { TokenTracker, Scope, Parameter } from './utils';
import { parseParameters } from './function/parameters';
import { ParserError } from './error';

export function parsePipeOperation(
  tt: TokenTracker,
  parseExpr: T.ExpressionParsingFunction,
  scope: Scope,
  prevExpr: T.Expr,
): T.Expr {
  const receiver = prevExpr;
  tt.next(); // skip `|>`

  if (tt.is('ident')) {
    if (scope.hasFunction(tt.value)) {
      const funcName = tt.value;
      tt.next(); // Skip `ident`: function name

      if (tt.isNot('lparen'))
        ParserError(`Expect function invocation's parameter to be nested by parentheses, instead got token of type: \`${tt.type}\``);
      tt.next();
      const params = parseParameters(tt, parseExpr, scope);
      params.unshift(receiver);

      const typeParams = Parameter.from(params.map(p => p.return));
      const pattern = scope.getFunctionPattern(funcName, typeParams);

      return {
        type: 'FunctionInvokeExpr',
        name: pattern.name,
        return: pattern.returnDataType,
        params,
      } as T.FunctionInvokeExpr;
    };
  }

  ParserError(`Unhandled token of type \`${tt.type}\` in pipe-operation`);
}