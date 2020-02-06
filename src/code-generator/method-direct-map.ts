export const StrMethodsDirectMap = new Map<string, string>([
  ['upcase', 'toUpperCase'],
  ['repeat', 'repeat'],
  ['toStr', 'toString'],
]);

export const NumMethodsDirectMap = new Map<string, string>([
  ['toStr', 'toString'],
]);

export const BoolMethodsDirectMap = new Map<string, string>([
  ['toStr', 'toString'],
]);

export const MethodsDirectMap = new Map([
  ['Str', StrMethodsDirectMap],
  ['Num', NumMethodsDirectMap],
  ['Bool', BoolMethodsDirectMap],
]);
