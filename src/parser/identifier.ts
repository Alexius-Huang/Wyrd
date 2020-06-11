import * as T from '../types';
import { TokenTracker, Scope, DataType as DT } from './utils';
import { parseFunctionInvokeExpr } from './function';
import { parseMethodInvokeExpr } from './method';
import { parseVarAssignmentExpr } from './assignment';
import { parseConstantDeclaration } from './assignment/constant-declaration';
import { parseRecordReferenceExpr } from './record';
import { parseTypeLiteral } from './type-literal';
import { ParserError } from './error';

export function parseIdentifier(
  tt: TokenTracker,
  parseExpr: T.ExpressionParsingFunction,
  scope: Scope,
  prevExpr?: T.Expr,
): T.Expr {
  const tokenName = tt.value;
  let result: T.Expr = {
    type: 'IdentLiteral',
    value: tokenName,
    return: DT.Invalid,
  };

  /* Handle Identifier as a Variable */
  if (scope.hasVariable(tokenName)) {
    const varInfo = scope.getVariable(tokenName);
    result.return = varInfo.type;

    if (tt.peekIs('eq')) {
      tt.next();
      if (varInfo.isConst)
        ParserError(`\`${varInfo.name}\` is declared as constant, not a variable`);
      return parseVarAssignmentExpr(tt, parseExpr, scope, result);
    }

    else if (tt.peekIs('ref')) {
      tt.next();
      return parseRecordReferenceExpr(tt, parseExpr, scope, result);
    }

    while (tt.peekIs('dot') || tt.peekIs('ref')) {
      tt.next();
      if (tt.is('dot')) {
        result = parseMethodInvokeExpr(tt, parseExpr, scope, result);
      } else {
        result = parseRecordReferenceExpr(tt, parseExpr, scope, result);
      }
    }
  }

  /* Handle Identifier as a Function*/
  else if (scope.hasFunction(tokenName)) {
    if (!tt.peekIs('lparen'))
      ParserError(`Unhandled function \`${tokenName}\` as a value, currently Wyrd-Lang do not support function object`);

    result = parseFunctionInvokeExpr(tt, parseExpr, scope, prevExpr);
    while (tt.peekIs('dot') || tt.peekIs('ref')) {
      tt.next();
      if (tt.is('dot')) {
        result = parseMethodInvokeExpr(tt, parseExpr, scope, result);
      } else {
        result = parseRecordReferenceExpr(tt, parseExpr, scope, result);
      }
    }
  }

  else if (scope.hasGenericType(tokenName)) {
    const typeLiteral = parseTypeLiteral(tt, parseExpr, scope);

    if (tt.peekIs('ident')) {
      tt.next();

      if (tt.peekIs('eq'))
        return parseConstantDeclaration(tt, parseExpr, scope, typeLiteral);
      ParserError(`Unhandled token of type \`${tt.type}\``);
    }
    return typeLiteral;
  }

  else if (scope.hasGenericPlaceholder(tokenName)) {
    result.return = DT.Void;
    return result;
  }

  if (prevExpr?.type === 'BinaryOpExpr') {
    if(DT.isInvalid(result.return))
      ParserError(`Using the unidentified token \`${tokenName}\``);
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

  if (result.type === 'IdentLiteral' && DT.isInvalid(result.return))
    ParserError(`Using the unidentified token \`${result.value}\``);

  return result;
}
