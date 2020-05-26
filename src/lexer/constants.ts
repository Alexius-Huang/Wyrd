const keyvalues = new Set<string>([
  'True',
  'False',
  'Null',
]);

const keywords = new Set<string>([
  'def',
  'do',
  'end',
  'and',
  'or',
  'not',
  'if',
  'elif',
  'else',
  'then',
  'mutable',
  'maybe',
  'override',
  'this',
  'record',
  // 'tuple',
  'of',
]);

const regex = {
  number: /[0-9]/,
  letter: /[a-zA-Z]/,
  naming: /[a-zA-Z0-9]/,
  whitespace: /\s/i,
};

const builtinTypes = new Set<string>([
  'Num',
  'Str',
  'Bool',
  'Null',
  'List',
  // 'Record',
  // 'Tuple',
  'Void',
]);

export {
  keyvalues,
  keywords,
  regex,
  builtinTypes,
};
