import * as T from '../../types';
import { TokenTracker, Scope, Parameter, DataType as DT } from '../utils';
import { ParserErrorIf, ParserError } from '../error';
import { parseParameters } from './parameter';

/**
 *  Basic case of invoking method from values, for instance: 123.toStr()
 */
export function parseValueMethodInvokeExpr(
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
    result.params = parseParameters(tt, parseExpr, scope);

  // Strip down the prioritized layer since the receiver will always be a single node
  if (result.receiver.type === 'PrioritizedExpr')
    result.receiver = result.receiver.expr;

  const receiverType = prevExpr.return;

  if (scope.hasMethod(receiverType, name)) {
    const parameter = Parameter.from(result.params.map(expr => expr.return));
    const methodPattern = scope.getMethodPattern(receiverType, name, parameter);
    if (methodPattern === undefined)
      ParserError(`Method for ${receiverType}.${name} with input pattern \`${parameter}\` doesn't exist`);

    result.isNotBuiltin = methodPattern.isNotBuiltin;
    result.name = result.isNotBuiltin ? `${receiverType.type}_${methodPattern.name}`  : methodPattern.name;

    const returnType = methodPattern.returnDataType;
    if (returnType.hasTypeParameters()) {
      result.return = returnType.applyTypeParametersFrom(receiverType);
    } else if (returnType.isGeneric) {
      result.return = receiverType.typeParameterMap[returnType.type];
    } else {
      result.return = returnType;
    }
  }
  else
    ParserError(`Invoking an undeclated method \`${receiverType}.${name}\``);

  return result;
}
