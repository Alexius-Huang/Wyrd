import { FunctionPatternInfo, FunctionPattern } from '../types';

export function createFunctionPatterns(
  functionPatterns: Array<[string, Array<[string, string]>]>
): Map<string, FunctionPattern> {
  return new Map<string, FunctionPattern>(
    functionPatterns.map(([name, patterns]) => createFunctionPattern(name, patterns))
  );
}

export function createFunctionPattern(
  name: string,
  patterns: Array<[string, string]>
): [string, FunctionPattern] {
  const result: [string, FunctionPattern] = [
    name,
    {
      name,
      patterns: new Map<Symbol, FunctionPatternInfo>(),
    }
  ];

  patterns.forEach(pattern => {
    const inputSymbol = Symbol.for(pattern[0]);
    const patternInfo: FunctionPatternInfo = {
      returnType: pattern[1],
    };

    result[1].patterns.set(inputSymbol, patternInfo);
  });

  return result;
}
