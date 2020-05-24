import * as T from '../../types';
import { TokenTracker, DataType as DT, Scope } from '../utils';

export function parseStringLiteral(
  tt: TokenTracker,
  scope: Scope,
  prevExpr?: T.Expr
): T.Expr {
  return {
    type: 'StringLiteral',
    value: tt.value,
    return: DT.Str,
  };
}
