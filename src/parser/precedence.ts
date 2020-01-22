import { Operator as Op, Precedence, Operator } from '../types';

export const PercedenceTable = [
  [Op.Percent],
  [Op.Asterisk, Op.Slash],
  [Op.Plus, Op.Dash],
  [Op.Gt, Op.Lt, Op.GtEq, Op.LtEq, Op.EqEq, Op.BangEq],
];

export function compare(op1: Operator, op2: Operator): Precedence {
  let op1Level: number = NaN, op2Level: number = NaN;

  for (let i = 0; i < PercedenceTable.length; i += 1) {
    const ops = PercedenceTable[i];

    if (ops.indexOf(op1) !== -1) op1Level = i;
    if (ops.indexOf(op2) !== -1) op2Level = i;

    if (!isNaN(op1Level) && !isNaN(op2Level)) break;
  }

  if (op1Level < op2Level)   return Precedence.High;
  if (op1Level === op2Level) return Precedence.Equal;
  return Precedence.Low;
}