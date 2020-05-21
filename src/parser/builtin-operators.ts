import { Scope, DataType as DT } from './utils';

export default function setupBuiltinOperators(scope: Scope) {
  const arithmeticOperators = ['+', '-', '*', '/', '%'];
  const logicalOperators = ['>', '<', '==', '>=', '<=', '!='];

  arithmeticOperators.forEach(op => {
    const operatorObj = scope.createOperator(op);
    operatorObj.createNewPattern(DT.Num, DT.Num, DT.Num, { isNotBuiltin: false });
  });

  logicalOperators.forEach(op => {
    const operatorObj = scope.createOperator(op);
    operatorObj.createNewPattern(DT.Bool, DT.Bool, DT.Bool, { isNotBuiltin: false });
  });

  return scope;
}
