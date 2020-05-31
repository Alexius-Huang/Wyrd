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
  'import',
]);

const libTags = new Set<string>([
  'direct-method-mapping',
  'maps',
  'params',
  'returns',
  'end',
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
  'Void',
]);

export {
  keyvalues,
  keywords,
  libTags,
  regex,
  builtinTypes,
};
