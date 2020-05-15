import * as T from '../types';
import { TokenTracker, Scope, DataType as DT } from './classes';

export function parseTypeLiteral(
  tt: TokenTracker,
  parseExpr: (prevExpr?: T.Expr, meta?: any) => T.Expr,
  scope: Scope
): T.Expr {
  const result: T.TypeLiteral = {
    type: 'TypeLiteral',
    value: tt.value,
    return: DT.Void,
  };

  return result;
};