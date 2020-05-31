import * as T from '../types';
import { DataType as DT } from './utils';

export const Primitives = new Set(['Num', 'Str', 'Bool']);
export const BuiltinLibs = new Set(['Math']);

export const EmptyExpression: T.EmptyExpr = { type: 'EmptyExpr', return: DT.Invalid };
export const VoidExpression: T.VoidExpr = { type: 'VoidExpr', return: DT.Void };
