import * as T from '../../types';
import { TokenTracker, Scope, DataType as DT } from '../utils';
import { parseNumberLiteral } from './number';
import { parseStringLiteral } from './string';
import { parseBooleanLiteral } from './boolean';
import { parseNullLiteral } from './null';
import { parseMethodInvokeExpr } from '../method/invocation';
import { ParserError } from '../error';
import { parseConstantDeclaration } from '../assignment/constant-declaration';

const primitiveMapParsingFunctions = new Map([
  ['number', parseNumberLiteral],
  ['string', parseStringLiteral],
  ['boolean', parseBooleanLiteral],
  ['null', parseNullLiteral],
]);

export function parsePrimitive(
  tt: TokenTracker,
  parseExpr: T.ExpressionParsingFunction,
  scope: Scope,
  prevExpr?: T.Expr,
): T.Expr {
  const parseSpecificPrimitive = primitiveMapParsingFunctions.get(tt.type) as
    (tt: TokenTracker, scope: Scope, prevExpr?: T.Expr) => T.Expr;
  let result = parseSpecificPrimitive(tt, scope, prevExpr);

  if (result.type === 'NullLiteral') {
    /* Null type of constant declaration */
    if (tt.peekIs('ident')) {
      tt.next();
      if (tt.peekIs('eq'))
        return parseConstantDeclaration(tt, parseExpr, scope, {
          type: 'TypeLiteral',
          value: 'Null',
          typeObject: DT.Null,
          return: DT.Void
        });
      ParserError(`Unhandled token of type \`${tt.type}\``);
    }
  }

  /* Parse wuth method invocation if value chained directly with dot token */
  while (tt.peekIs('dot')) {
    tt.next();
    result = parseMethodInvokeExpr(tt, parseExpr, scope, result);
  }

  // TODO: After implement operator overloading, should also test
  //       operator mixed method invocation
  if (prevExpr?.type === 'BinaryOpExpr') {
    prevExpr.expr2 = result;
    const operator = prevExpr.operator;
    const opLeft = prevExpr.expr1.return;
    const opRight = result.return;
    const operatorObj = scope.getOperatorPattern(operator, opLeft, opRight);

    if (operatorObj === undefined)
      ParserError(`Invalid operation for operator \`${prevExpr.operator}\` with operands of type \`${opLeft}\` and \`${opRight}\``);

    prevExpr.return = operatorObj.returnDataType;
    return prevExpr;
  }

  if (prevExpr?.type === 'PrioritizedExpr') {
    prevExpr.expr = result;
    prevExpr.return = result.return;
  }

  return result;
}
