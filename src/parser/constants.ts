import { OPAction, OPActionPair, EmptyExpr } from "../types";

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
