import * as T from '../types';
import { TokenTracker, Scope, DataType as DT } from './utils';
import { ParserError } from './error';

export function parseTypeLiteral(
  tt: TokenTracker,
  parseExpr: T.ExpressionParsingFunction,
  scope: Scope
): T.TypeLiteral {
  const result: T.TypeLiteral = {
    type: 'TypeLiteral',
    value: tt.value,
    typeObject: new DT(tt.value),
    return: DT.Void,
  };

  if (scope.hasGenericType(tt.value)) {
    const gt = scope.getGenericType(tt.value);
    if (!tt.peekIs('lt'))
      ParserError(`Type \`${tt.value}\` has generic type parameters ${gt.typeParameters.map(tp => `\`${tp}\``)}`);

    tt.next(); // skip `ident` token
    tt.next(); // skip `lt` token

    const tps = Array.from(gt.typeParameters);
    for (let i = 0; i < tps.length; i += 1) {
      const tp = tps[i];
      if (tt.isNotOneOf('ident', 'builtin-type'))
        ParserError(`Expect type parameters in generic type \`${gt.name}\` has ${tps.length} type parameter(s), instead got: ${i}`);

      const typeLit = parseTypeLiteral(tt, parseExpr, scope);
      result.typeObject.newTypeParameter(tp.name, typeLit.typeObject);
      tt.next();

      if (tt.is('comma')) tt.next();
    }

    if (tt.isOneOf('builtin-type', 'ident'))
      ParserError(`Expect type parameters in generic type \`${gt.name}\` has ${tps.length} type parameter(s), instead got more than ${tps.length}`)

    if (tt.isNot('gt'))
      ParserError(`Expect type parameters in generic type literal to end with token \`gt\`, instead got token of type \`${tt.type}\``);
  }

  return result;
};
