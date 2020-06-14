import * as T from '../../types';
import { TokenTracker, Scope, DataType as DT } from '../utils';
import { parseConstantDeclaration } from '../assignment/constant-declaration';
import { parseRecordLiteral } from '../record';
import { ParserError } from '../error';
import { parseMethodInvokeExpr } from '../method';

export function handleRecordIdentifier(
  tt: TokenTracker,
  parseExpr: T.ExpressionParsingFunction,
  scope: Scope,
  prevExpr?: T.Expr,
): T.Expr {
  const recordName = tt.value;
  const recordType = new DT(recordName);
  const typeLiteral: T.TypeLiteral = {
    type: 'TypeLiteral',
    typeObject: recordType,
    value: recordName,
    return: DT.Void,
  };

  if (tt.peekIs('lcurly')) {
    return parseRecordLiteral(tt, parseExpr, scope, prevExpr);
  }
  
  else if (tt.peekIs('ident')) {
    tt.next();

    if (tt.peekIs('eq'))
      return parseConstantDeclaration(tt, parseExpr, scope, typeLiteral);
  }

  else if (tt.peekIs('dot')) {
    tt.next();
    return parseMethodInvokeExpr(tt, parseExpr, scope, typeLiteral);
  }

  ParserError(`Unhandled token of type \`${tt.type}\``);
}
