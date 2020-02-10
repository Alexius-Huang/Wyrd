import * as T from '../types';
import TokenTracker from './TokenTracker';
import Scope from './Scope';

export function parseTypeLiteral(
  tt: TokenTracker,
  parseExpr: (prevExpr?: T.Expr, meta?: any) => T.Expr,
  scope: Scope
): T.Expr {
  const result: T.TypeLiteral = {
    type: 'TypeLiteral',
    value: tt.value,
    returnType: 'Void',
  };

  return result;
};