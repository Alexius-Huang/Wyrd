import * as T from '../../types';
import { TokenTracker, Scope, DataType as DT } from '../utils';
import { ParserErrorIf } from '../error';
import { parseParameters } from '../function/parameters';
import { EmptyExpression } from '../constants';

/**
 *  Invoke method via type, for instance: Num.toStr(123)
 *  is equivalent to: 123.toStr()
 */
export function parseReceiverAsType(
  tt: TokenTracker,
  parseExpr: (orevExpr?: T.Expr, meta?: any) => T.Expr,
  scope: Scope,
  prevExpr: T.TypeLiteral,
): T.MethodInvokeExpr {
  const result: T.MethodInvokeExpr = {
    type: 'MethodInvokeExpr',
    name: 'UNDECIDED',
    receiver: EmptyExpression,
    params: [],
    return: DT.Invalid,
  };
  const receiverType = prevExpr.typeObject;
  const methodName = `${receiverType}.${tt.value}`;

  tt.next(); // Skip the name of the method
  
  ParserErrorIf(tt.isNot('lparen'), `Expect method \`${methodName}\` invocation should follow with token \`lparen\``);
  tt.next(); // Skip the left parentheses

  ParserErrorIf(tt.is('comma'), `Expect next token is an expression as parameter of method \`${methodName}\`, instead got \`comma\``);

  if (tt.isNot('rparen'))
    result.params = parseParameters(tt, parseExpr, scope);

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

  return result;
}
