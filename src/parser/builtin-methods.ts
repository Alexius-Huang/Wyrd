import { Scope, Parameter, DataType as DT } from './utils';

type DefaultMethodFormat = {
  name: string;
  parameter?: Parameter;
  return?: DT;
  directMapping?: string;
};

const BuiltinListMethods: Array<DefaultMethodFormat> = [
  { name: 'push', parameter: Parameter.of(DT.Generic('element')), return: DT.Generic('element') },
  { name: 'concat', parameter: Parameter.of(DT.GenericList()), return: DT.GenericList() }
];

export default function setupBuiltinMethods(scope: Scope) {
  BuiltinListMethods.forEach(({ name, directMapping, parameter, return: r }) => {
    const methodObj = scope.createMethod(DT.ListOf(DT.Generic('element')), name);
    methodObj.createNewPattern(parameter ?? Parameter.Void(), r ?? DT.Generic('element'), { directMapping: directMapping ?? name, isNotBuiltin: false });
  });
}
