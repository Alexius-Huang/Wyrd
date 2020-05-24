import * as T from '../../types';
import { TokenTracker, DataType as DT, Scope } from '../utils';

export function parseNullLiteral(
  tt: TokenTracker,
  scope: Scope,
  prevExpr?: T.Expr
): T.Expr {
  return {
    type: 'NullLiteral',
    value: 'Null',
    return: DT.Null,
  };
}
