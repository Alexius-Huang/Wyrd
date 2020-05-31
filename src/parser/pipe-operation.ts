import * as T from '../types';
import { TokenTracker, Scope, Parameter, DataType as DT } from './utils';
import { parseParameters } from './function/parameters';
import { ParserError } from './error';
import { parseTypeLiteral } from './type-literal';

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
    }
  }

  /* Method invocation by type */
  else if (tt.is('builtin-type')) {
    const typeLiteral: T.TypeLiteral = parseTypeLiteral(tt, parseExpr, scope);
    const receiverType = typeLiteral.typeObject;
    if (receiverType.isNotEqualTo(receiver.return))
      ParserError(`Expect receiver in pipe-operation to have type \`${receiverType}\`, instead got type \`${receiver.return}\``);
    tt.next(); // Skip `type`

    if (tt.isNot('dot'))
      ParserError(`Expect invoking method in pipe-operation token of type \`dot\`, instead got: \`${tt.type}\``);
    tt.next(); // Skip `dot`

    if (tt.isNot('ident'))
      ParserError(`Expect invoking method in pipe-operation with the name of the method, instead got token of type: \`${tt.type}\``);
    const tokMethodName = tt.value;
    const methodInvokeName = `${receiverType}.${tokMethodName}`;
    if (!scope.hasMethod(receiverType, tokMethodName))
      ParserError(`Invoking an undeclared method \`${methodInvokeName}\` during pipe operation`);  
    tt.next(); // Skip `ident`

    if (tt.isNot('lparen'))
      ParserError(`Expect method invocation's parameter to be nested by parentheses, instead got token of type: \`${tt.type}\``);
    tt.next(); // Skip `lparen`
    const params = parseParameters(tt, parseExpr, scope);

    const typeParams = Parameter.from(params.map(p => p.return));
    const methodPattern = scope.getMethodPattern(receiverType, tokMethodName, typeParams);
    if (methodPattern === undefined)
      ParserError(`Method for \`${methodInvokeName}\` with input pattern \`${typeParams}\` doesn't exist`);

    const result: T.MethodInvokeExpr = {
      type: 'MethodInvokeExpr',
      isNotBuiltin: methodPattern.isNotBuiltin,
      receiver,
      params,
      name: methodPattern.isNotBuiltin ? `${receiverType.type}_${methodPattern.name}`  : methodPattern.name,
      return: DT.Unknown,
    };
  
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

  if (tt.is('ident'))
    ParserError(`Unknown identifier \`${tt.value}\` is used`);
  ParserError(`Pipe operation do not accept token of type \`${tt.type}\``);
}