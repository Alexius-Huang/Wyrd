import { lex } from './lexer/index';
import { parse } from './parser/index';
import { generateCode } from './codeGenerator';
import * as T from './types';

export function compile(
  code: string,
  options?: {
    parseOptions?: T.ParseOptions,
  },
): string {
  const tokens = lex(code);
  const ast = parse(tokens, options?.parseOptions);
  const result = generateCode(ast);

  return result;
}
