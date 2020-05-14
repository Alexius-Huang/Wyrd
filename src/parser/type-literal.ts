import * as T from '../types';
import TokenTracker from './classes/TokenTracker';
import Scope from './classes/Scope';
import DT from './classes/DataType';

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