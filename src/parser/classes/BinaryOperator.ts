import DT from './DataType';
import { Operand } from '../../types';

export default class BinaryOperator {
  private operands: Operand[] = [];

  constructor(public symbol: string) {}

  public newOperation(operand: Operand) {
    this.operands.push(operand);
  }

  public newOperations(operands: Operand[]) {
    this.operands.push(...operands);
  }

  public hasOperation(left: DT, right: DT) {
    return this.operands.find(
      opr => opr.left.isEqualTo(left) && opr.right.isEqualTo(right)
    ) !== undefined;
  }

  public returnTypeOfOperation(left: DT, right: DT) {
    return this.operands.find(
      opr => opr.left.isEqualTo(left) && opr.right.isEqualTo(right)
    )?.return;
  }
}
