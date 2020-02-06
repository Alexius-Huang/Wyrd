export const StrMethodsDirectMap = new Map<string, string>([
  ['upcase', 'toUpperCase'],
  ['downcase', 'toLowerCase'],
  ['repeat', 'repeat'],
  ['toStr', 'toString'],
  ['at', 'charAt'],
  ['concat', 'concat'],
  ['indexOf', 'indexOf'],
  ['split', 'split'],
  ['rest', 'slice'],
  ['between', 'slice'],
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
