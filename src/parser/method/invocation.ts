import * as T from '../../types';
import { parseReceiverAsValue } from './receiver-as-value';
import { parseReceiverAsType } from './receiver-as-type';
import { TokenTracker, Scope, Parameter } from '../utils';
import { ParserErrorIf, ParserError } from '../error';

export function parseMethodInvokeExpr(
  tt: TokenTracker,
  parseExpr: (orevExpr?: T.Expr, meta?: any) => T.Expr,
  scope: Scope,
  prevExpr: T.Expr,
): T.MethodInvokeExpr {
  tt.next(); // Skip the `dot` token
  const name = tt.value;

  ParserErrorIf(tt.isNot('ident'), `Expect method invoke with token of type \`identifier\`, got token of type \`${tt.type}\``);

  let result: T.MethodInvokeExpr;
  if (prevExpr.type === 'TypeLiteral')
    result = parseReceiverAsType(tt, parseExpr, scope, prevExpr);
  else
    result = parseReceiverAsValue(tt, parseExpr, scope, prevExpr);

  const receiverType = result.receiver.return;
  if (!scope.hasMethod(receiverType, name))
    ParserError(`Invoking an undeclared method \`${receiverType}.${name}\``);  

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

  return result;
}
