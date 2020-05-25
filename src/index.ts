import { lex } from './lexer';
import { parse } from './parser';
import { generateCode } from './code-generator';
import * as T from './types';

export function compile(
  code: string,
  options?: {
    parseOptions?: T.ParseOptions,
    minify?: boolean,
    showAST?: boolean;
  },
): string {
  const tokens = lex(code);
  const ast = parse(tokens, options?.parseOptions);

  if (options?.showAST) {
    console.log('/* AST */');
    ast.forEach((n) => console.log(n));
  }

  const minify = options?.minify ?? false;
  const result = generateCode(ast, { minify });

  return result;
}
