import { OPAction, OPActionPair } from '../types';
import { BuiltinOPActions } from './constants';
import { ParserErrorIf } from './error';

export function getOPActionDetail(op: string, type1: string, type2: string): OPActionPair {
  const opAction =  BuiltinOPActions.get(op);
  ParserErrorIf(opAction === undefined, `Unhandled operator \`${op}\``);

  const actionPairKey = Symbol.for(`${type1}.${type2}`);
  const action = (opAction as OPAction).actionPairs.get(actionPairKey);

  ParserErrorIf(action === undefined, `Unhandled operator \`${op}\` with paired type \`${type1}\` and \`${type2}\``);
  return action as OPActionPair;
}
