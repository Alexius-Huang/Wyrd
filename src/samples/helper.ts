import * as T from '../types';

export function createFunctionPatterns(
  functionPatterns: Array<[string, Array<[string, string]>]>
): Map<string, T.FunctionPattern> {
  return new Map<string, T.FunctionPattern>(
    functionPatterns.map(([name, patterns]) => createFunctionPattern(name, patterns))
  );
}

export function createFunctionPattern(
  name: string,
  patterns: Array<[string, string]>
): [string, T.FunctionPattern] {
  const result: [string, T.FunctionPattern] = [
    name,
    {
      name,
      patterns: new Map<Symbol, T.FunctionPatternInfo>(),
    }
  ];

  patterns.forEach(pattern => {
    const inputSymbol = Symbol.for(pattern[0]);
    const patternInfo: T.FunctionPatternInfo = {
      returnType: pattern[1],
    };

    result[1].patterns.set(inputSymbol, patternInfo);
  });

  return result;
}

export function NumberLiteral(value: string): T.NumberLiteral {
  return { type: 'NumberLiteral', value, returnType: 'Num' };
}

export function StringLiteral(value: string): T.StringLiteral {
  return { type: 'StringLiteral', value, returnType: 'Str' };
}

export function BooleanLiteral(bool: boolean): T.BooleanLiteral {
  return { type: 'BooleanLiteral', value: bool ? 'True' : 'False', returnType: 'Bool' };
}

export function NullLiteral(): T.NullLiteral {
  return { type: 'NullLiteral', value: 'Null', returnType: 'Null' };
}

export function prioritize(expr: T.Expr): T.PrioritizedExpr {
  return {
    type: 'PrioritizedExpr',
    returnType: expr.returnType,
    expr,
  };
}
