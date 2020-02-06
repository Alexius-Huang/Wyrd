import { OPAction, OPActionPair, EmptyExpr, MethodPattern } from "../types";

export const Primitives = new Set(['Num', 'Str', 'Bool']);
export const EmptyExpression: EmptyExpr = { type: 'EmptyExpr', returnType: 'Invalid' };

export const BuiltinBinaryOperators = new Set<string>([
  '+',
  '-',
  '*',
  '/',
  '%',
  '>',
  '<',
  '>=',
  '<=',
  '==',
  '!=',
]);

export const LogicalBinaryOperators = new Set<string>([
  '>',
  '<',
  '>=',
  '<=',
  '==',
  '!='
]);

export const BuiltinOPActions = new Map<string, OPAction>([
  [
    '+',
    {
      symbol: '+',
      actionPairs: new Map<Symbol, OPActionPair>([
        [Symbol.for('Num.Num'), { returnType: 'Num' }],
      ]),
    },
  ],
  [
    '-',
    {
      symbol: '-',
      actionPairs: new Map<Symbol, OPActionPair>([
        [Symbol.for('Num.Num'), { returnType: 'Num' }],
      ]),
    },
  ],
  [
    '*',
    {
      symbol: '*',
      actionPairs: new Map<Symbol, OPActionPair>([
        [Symbol.for('Num.Num'), { returnType: 'Num' }],
      ]),
    },
  ],
  [
    '/',
    {
      symbol: '/',
      actionPairs: new Map<Symbol, OPActionPair>([
        [Symbol.for('Num.Num'), { returnType: 'Num' }],
      ]),
    },
  ],
  [
    '%',
    {
      symbol: '%',
      actionPairs: new Map<Symbol, OPActionPair>([
        [Symbol.for('Num.Num'), { returnType: 'Num' }],
      ]),
    },
  ],
  [
    '==',
    {
      symbol: '==',
      actionPairs: new Map<Symbol, OPActionPair>([
        [Symbol.for('Num.Num'), { returnType: 'Bool' }],
        [Symbol.for('Str.Str'), { returnType: 'Bool' }],
        [Symbol.for('Bool.Bool'), { returnType: 'Bool' }],
        [Symbol.for('Null.Null'), { returnType: 'Bool' }],
      ]),
    },
  ],
  [
    '!=',
    {
      symbol: '!=',
      actionPairs: new Map<Symbol, OPActionPair>([
        [Symbol.for('Num.Num'), { returnType: 'Bool' }],
        [Symbol.for('Str.Str'), { returnType: 'Bool' }],
        [Symbol.for('Bool.Bool'), { returnType: 'Bool' }],
        [Symbol.for('Null.Null'), { returnType: 'Bool' }],
      ]),
    },
  ],
  [
    '>',
    {
      symbol: '>',
      actionPairs: new Map<Symbol, OPActionPair>([
        [Symbol.for('Num.Num'), { returnType: 'Bool' }],
        [Symbol.for('Str.Str'), { returnType: 'Bool' }],
        [Symbol.for('Bool.Bool'), { returnType: 'Bool' }],
        [Symbol.for('Null.Null'), { returnType: 'Bool' }],
      ]),
    },
  ],
  [
    '>=',
    {
      symbol: '>=',
      actionPairs: new Map<Symbol, OPActionPair>([
        [Symbol.for('Num.Num'), { returnType: 'Bool' }],
        [Symbol.for('Str.Str'), { returnType: 'Bool' }],
        [Symbol.for('Bool.Bool'), { returnType: 'Bool' }],
        [Symbol.for('Null.Null'), { returnType: 'Bool' }],
      ]),
    },
  ],
  [
    '<',
    {
      symbol: '<',
      actionPairs: new Map<Symbol, OPActionPair>([
        [Symbol.for('Num.Num'), { returnType: 'Bool' }],
        [Symbol.for('Str.Str'), { returnType: 'Bool' }],
        [Symbol.for('Bool.Bool'), { returnType: 'Bool' }],
        [Symbol.for('Null.Null'), { returnType: 'Bool' }],
      ]),
    },
  ],
  [
    '<=',
    {
      symbol: '<=',
      actionPairs: new Map<Symbol, OPActionPair>([
        [Symbol.for('Num.Num'), { returnType: 'Bool' }],
        [Symbol.for('Str.Str'), { returnType: 'Bool' }],
        [Symbol.for('Bool.Bool'), { returnType: 'Bool' }],
        [Symbol.for('Null.Null'), { returnType: 'Bool' }],
      ]),
    },
  ],
]);

export const BuiltinStrMethods = new Map<string, MethodPattern>([
  ['upcase',   { name: 'upcase',   inputPattern: '',        returnType: 'Str'       }],
  ['downcase', { name: 'downcase', inputPattern: '',        returnType: 'Str'       }],
  ['repeat',   { name: 'repeat',   inputPattern: 'Num',     returnType: 'Str'       }],
  ['toStr',    { name: 'toStr',    inputPattern: '',        returnType: 'Str'       }],
  ['at',       { name: 'at',       inputPattern: 'Num',     returnType: 'Str'       }],
  ['concat',   { name: 'concat',   inputPattern: 'Str',     returnType: 'Str'       }],
  ['indexOf',  { name: 'indexOf',  inputPattern: 'Str',     returnType: 'Num'       }],
  ['split',    { name: 'split',    inputPattern: 'Str',     returnType: 'List[Str]' }],
  ['rest',     { name: 'rest',     inputPattern: 'Num',     returnType: 'Str'       }],
  ['between',  { name: 'between',  inputPattern: 'Num.Num', returnType: 'Str'       }],
]);

export const BuiltinNumMethods = new Map<string, MethodPattern>([
  ['toStr', { name: 'toStr', inputPattern: '', returnType: 'Str' }],
]);

export const BuiltinBoolMethods = new Map<string, MethodPattern>([
  ['toStr', { name: 'toStr', inputPattern: '', returnType: 'Str' }],
])

export const BuiltinPrimitiveMethods = new Map([
  ['Str', BuiltinStrMethods],
  ['Num', BuiltinNumMethods],
  ['Bool', BuiltinBoolMethods],
]);
