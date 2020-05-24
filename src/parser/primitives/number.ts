import * as T from '../../types';
import { TokenTracker, DataType as DT, Scope } from '../utils';

export function parseNumberLiteral(
  tt: TokenTracker,
  scope: Scope,
  prevExpr?: T.Expr
): T.Expr {
  return {
    type: 'NumberLiteral',
    value: tt.value,
    return: DT.Num,
  };
}
