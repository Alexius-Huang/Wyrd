import { lex } from './lexer';
import { parse } from './parser';
import { Scope } from './parser/utils';
import { generateCode } from './code-generator';
import setupBuiltinMethods from './parser/builtin-methods';
import setupBuiltinOperators from './parser/builtin-operators';

import * as T from './types';

type CompileResult = {
  result: string;
  ast: T.AST;
};

export function compile(
  code: string,
  options?: {
    parseOptions?: T.ParseOptions,
    minify?: boolean,
    showAST?: boolean,
    dir?: string,
  },
): CompileResult {
  const tokens = lex(code);
  const opt = options?.parseOptions ?? {};
  const rootDir = options?.dir ?? __dirname;

  let globalScope = new Scope();

  /* TODO: Load as library */
  const listGT = globalScope.declareGenericType('List');
  listGT.declareTypeParameter('element');

  setupBuiltinMethods(globalScope);
  setupBuiltinOperators(globalScope);

  if (opt.scope)
    globalScope = opt.scope(globalScope);

  const { ast } = parse(tokens, rootDir, globalScope);

  if (options?.showAST) {
    console.log('/* AST */');
    ast.forEach((n) => console.log(n));
  }

  const minify = options?.minify ?? false;
  const result = generateCode(ast, { minify });

  return { result, ast };
}
