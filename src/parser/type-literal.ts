import * as T from '../types';
import { TokenTracker, Scope, DataType as DT } from './utils';

export function parseTypeLiteral(
  tt: TokenTracker,
  parseExpr: T.ExpressionParsingFunction,
  scope: Scope
): T.Expr {
  const result: T.TypeLiteral = {
    type: 'TypeLiteral',
    value: tt.value,
    return: DT.Void,
  };

  return result;
};