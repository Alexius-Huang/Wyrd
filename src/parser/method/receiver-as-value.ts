import * as T from '../../types';
import { TokenTracker, Scope, DataType as DT } from '../utils';
import { ParserErrorIf } from '../error';
import { parseParameters } from '../function/parameters';

/**
 *  Basic case of invoking method from values, for instance: 123.toStr()
 */
export function parseReceiverAsValue(
  tt: TokenTracker,
  parseExpr: (orevExpr?: T.Expr, meta?: any) => T.Expr,
  scope: Scope,
  prevExpr: T.Expr,
): T.MethodInvokeExpr {
  const result: T.MethodInvokeExpr = {
    type: 'MethodInvokeExpr',
    name: 'UNDECIDED',
    receiver: prevExpr,
    params: [],
    return: DT.Invalid,
  };
  const methodName = `${prevExpr.return.type}.${tt.value}`;

  tt.next(); // Skip the name of the method

  ParserErrorIf(tt.isNot('lparen'), `Expect method \`${methodName}\` invocation should follow with token \`lparen\``);
  tt.next(); // Skip the left parentheses

  ParserErrorIf(tt.is('comma'), `Expect next token is an expression as parameter of method \`${methodName}\`, instead got \`comma\``);

  if (tt.isNot('rparen'))
    result.params = parseParameters(tt, parseExpr, scope);

  // Strip down the prioritized layer since the receiver will always be a single node
  if (result.receiver.type === 'PrioritizedExpr')
    result.receiver = result.receiver.expr;

  return result;
}
