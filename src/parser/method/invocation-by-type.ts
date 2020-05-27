import * as T from '../../types';
import { TokenTracker, Scope, Parameter, DataType as DT } from '../utils';
import { ParserErrorIf, ParserError } from '../error';
import { parseParameters } from './parameter';
import { EmptyExpression } from '../constants';

/**
 *  Invoke method via type, for instance: Num.toStr(123)
 *  is equivalent to: 123.toStr()
 */
export function parseTypeMethodInvokeExpr(
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
    result.params = parseParameters(tt, parseExpr, scope);

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

    result.isNotBuiltin = methodPattern.isNotBuiltin;
    result.name = result.isNotBuiltin ? `${receiverType.type}_${methodPattern.name}`  : methodPattern.name;
    result.return = methodPattern.returnDataType;
  }

  return result;
}
