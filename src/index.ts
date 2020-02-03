import { lex } from './lexer/index';
import { parse } from './parser/index';
import { generateCode } from './codeGenerator';
import * as T from './types';

export function compile(
  code: string,
  options?: {
    parseOptions?: T.ParseOptions,
    minify?: boolean,
  },
): string {
  const tokens = lex(code);
  const ast = parse(tokens, options?.parseOptions);

  const minify = options?.minify ?? false;
  const result = generateCode(ast, { minify });

  return result;
}
