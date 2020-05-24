import * as T from '../../types';
import { TokenTracker, DataType as DT, Scope } from '../utils';

export function parseBooleanLiteral(
  tt: TokenTracker,
  scope: Scope,
  prevExpr?: T.Expr
): T.Expr {
  return {
    type: 'BooleanLiteral',
    value: tt.value as 'True' | 'False',
    return: DT.Bool,
  };
}
