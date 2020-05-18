import { Scope, Parameter, DataType as DT } from './utils';

type DefaultMethodFormat = {
  name: string;
  parameter?: Parameter;
  return?: DT;
  directMapping: string;
};

const BuiltinStrMethods: Array<DefaultMethodFormat> = [
  { name: 'upcase', directMapping: 'toUpperCase' },
  { name: 'downcase', directMapping: 'toLowerCase' },
  { name: 'repeat', parameter: Parameter.of(DT.Num), directMapping: 'repeat' },
  { name: 'toStr', directMapping: 'toString' },
  { name: 'at', parameter: Parameter.of(DT.Num), directMapping: 'charAt' },
  { name: 'concat', parameter: Parameter.of(DT.Str), directMapping: 'concat' },
  { name: 'indexOf', parameter: Parameter.of(DT.Str), directMapping: 'indexOf', return: DT.Num },
  { name: 'split', parameter: Parameter.of(DT.Str), directMapping: 'split', return: DT.ListOf(DT.Str) },
  { name: 'rest', parameter: Parameter.of(DT.Num), directMapping: 'slice' },
  { name: 'between', parameter: Parameter.of(DT.Num, DT.Num), directMapping: 'slice' },
];

const BuiltinNumMethods: Array<DefaultMethodFormat> = [
  { name: 'toStr', directMapping: 'toString', return: DT.Str },
];

const BuiltinBoolMethods: Array<DefaultMethodFormat> = [
  { name: 'toStr', directMapping: 'toString', return: DT.Str },
];

export default function setupBuiltinMethods(scope: Scope) {
  BuiltinStrMethods.forEach(({ name, directMapping, parameter, return: r }) => {
    const methodObj = scope.createMethod(DT.Str, name);
    methodObj.createNewPattern(parameter ?? Parameter.Void(), r ?? DT.Str, { directMapping });
  });

  BuiltinNumMethods.forEach(({ name, directMapping, parameter, return: r }) => {
    const methodObj = scope.createMethod(DT.Num, name);
    methodObj.createNewPattern(parameter ?? Parameter.Void(), r ?? DT.Num, { directMapping });
  });

  BuiltinBoolMethods.forEach(({ name, directMapping, parameter, return: r }) => {
    const methodObj = scope.createMethod(DT.Bool, name);
    methodObj.createNewPattern(parameter ?? Parameter.Void(), r ?? DT.Bool, { directMapping });
  });
}
