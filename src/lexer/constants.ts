const keywords = new Set<string>([
  'def',
  'do',
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
]);

export {
  keywords,
  regex,
  builtinTypes,
};
