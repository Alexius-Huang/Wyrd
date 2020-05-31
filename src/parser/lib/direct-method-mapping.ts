import * as T from '../../types';
import {
  TokenTracker,
  Scope,
  Parameter,
  ScopeMethodObject as MethodObject,
  DataType as DT
} from '../utils';
import { ParserError } from '../error';
import { parseTypeLiteral } from '../type-literal';
import { parseParameters } from '../function/parameters';

export function parseLibDirectMethodMapping(
  tt: TokenTracker,
  parseExpr: T.ExpressionParsingFunction,
  scope: Scope,
): Scope {
  tt.next(); // Skip `@direct-method-mapping`
  if (tt.isNot('newline'))
    ParserError(`Expect token after @direct-method-mapping to be \`newline\`, instead got \`${tt.type}\``)
  tt.next(); // Skip `newline`

  while (tt.isNot('lib-tag') && tt.valueIsNot('end')) {
    if (tt.isOneOf('builtin-type', 'ident'))
      configureDirectMethodMapping(tt, parseExpr, scope);
    tt.next();
  }

  return scope;
}

function configureDirectMethodMapping(
  tt: TokenTracker,
  parseExpr: T.ExpressionParsingFunction,
  scope: Scope,
) {
  if (tt.isNot('builtin-type') && !scope.hasGenericType(tt.value))
    ParserError(`Expect direct method mapping to declare the type and method name first, instead got token of type \`${tt.type}\``);
  const typeLiteral = parseTypeLiteral(tt, parseExpr, scope);
  let receiverType = typeLiteral.typeObject;

  const childScope = scope.createChildScope('dmm-declaration');
  if (receiverType.hasTypeParameters()) {
    const tps = receiverType.typeParameters;
    for (let i = 0; i < tps.length; i += 1) {
      const tp = tps[i];
      childScope.createGenericPlaceholder(tp.type.type, tp.name);
      tp.type.type = tp.name;
    }
  }

  tt.next(); // Skip 'builtin-type'

  if (tt.isNot('dot'))
    ParserError(`Expect direct method mapping's method name and receiver to be delimited by \`dot\`, instead got token of type \`${tt.type}\``)
  tt.next(); // Skip `dot`

  if (tt.isNot('ident'))
    ParserError(`Expect direct method mapping to declare with method name, instead got token of type \`${tt.type}\``)
  const methodName = tt.value;
  tt.next(); // Skip `ident`

  let mappedMethodParameter = Parameter.Void();
  let mappedMethodReturnType = receiverType;
  let mappedMethod = methodName;
  let methodObj: MethodObject;
  if (scope.hasMethod(receiverType, methodName))
    methodObj = scope.getMethod(receiverType, methodName);
  else
    methodObj = scope.createMethod(receiverType, methodName);

  while (tt.isNot('newline')) {
    if (tt.isNot('lib-tag'))
      ParserError(`Expect direct method mapping to parse with \`lib-tag\`, instead got token of type \`${tt.type}\``)

    if (tt.valueIs('maps')) {
      tt.next(); // Skip `@maps`
      checkLParenTokenExists('maps', tt);

      const params = parseParameters(tt, parseExpr, childScope);
      checkParameterLength('maps', params, 1);
      checkParameterType('maps', params[0], { type: 'StringLiteral', value: 'any', return: DT.Str });
      tt.next(); // Skip `rparen`
      mappedMethod = (params[0] as T.StringLiteral).value;
    }

    if (tt.valueIs('params')) {
      tt.next(); // Skip `@maps`
      checkLParenTokenExists('params', tt);

      const params = parseParameters(tt, parseExpr, childScope);
      tt.next(); // Skip `rparen`
      const typeParameters: Array<DT> = [];
      params.forEach(p => {
        if (p.type === 'IdentLiteral' && childScope.hasGenericPlaceholder(p.value)) {
          typeParameters.push(childScope.getGenericTypeFromPlaceholder(p.value));
        } else if (p.type === 'TypeLiteral') {
          typeParameters.push(p.typeObject);
        } else {
          ParserError(`Expect library tag \`@params\` to receive type literals, instead got value of type \`${params[0].return}\``);
        }
      });
      mappedMethodParameter = Parameter.from(typeParameters);
    }

    if (tt.valueIs('returns')) {
      tt.next(); // Skip `@returns`
      checkLParenTokenExists('returns', tt);

      const params = parseParameters(tt, parseExpr, childScope);
      checkParameterLength('returns', params, 1);

      if (params[0].type === 'IdentLiteral' && childScope.hasGenericPlaceholder(params[0].value)) {
        mappedMethodReturnType = childScope.getGenericTypeFromPlaceholder(params[0].value);
      } else if (params[0].type === 'TypeLiteral') {
        mappedMethodReturnType = params[0].typeObject;
      } else {
        ParserError(`Expect library tag \`@returns\` to receive \`type literal\`, instead got value of type \`${params[0].return}\``);
      }
      tt.next(); // Skip `rparen`
    }
  }

  methodObj.createNewPattern(
    mappedMethodParameter,
    mappedMethodReturnType,
    {
      directMapping: mappedMethod,
      isNotBuiltin: false
    },
  );
}

function checkLParenTokenExists(tagName: string, tt: TokenTracker) {
  if (tt.isNot('lparen'))
    ParserError(`Expect parameter of \`@${tagName}\` to surrounded by \`lparen\`, instead got token of type \`${tt.type}\``);
  tt.next(); // Skip `lparen`
}

function checkParameterLength(tagName: string, params: Array<T.Expr>, length: number) {
  if (params.length !== length)
    ParserError(`Expect library tag \`@${tagName}\` to receive only ${length} parameter(s), instead got ${params.length} parameter(s)`);
}

function checkParameterType(tagName: string, param: T.Expr, expected: T.Expr) {
  if (param.type !== expected.type)
    ParserError(`Expect library tag \`@${tagName}\` to receive \`${expected.return}\`, instead got value of type \`${param.return}\``);
}
