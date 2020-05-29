import { lex } from './lexer';
import { parse } from './parser';
import { Scope } from './parser/utils';
import { generateCode } from './code-generator';
import * as fs from 'fs';
import * as path from 'path';
import setupBuiltinMethods from './parser/builtin-methods';
import setupBuiltinOperators from './parser/builtin-operators';

import * as T from './types';

type CompileResult = {
  result: string;
  ast: T.AST;
};

export function compile(
  // code: string,
  options?: T.CompilerOptions,
): CompileResult {
  const content = options?.program ?? fs.readFileSync(options?.entry ?? __dirname, 'utf-8');
  const tokens = lex(content);

  const rootDir = options?.entry ? path.dirname(options.entry) : __dirname;

  let globalScope = new Scope();

  /* TODO: Load as library */
  const listGT = globalScope.declareGenericType('List');
  listGT.declareTypeParameter('element');

  setupBuiltinMethods(globalScope);
  setupBuiltinOperators(globalScope);

  if (options?.scopeMiddleware)
    globalScope = options.scopeMiddleware(globalScope);

  const { ast } = parse(tokens, {
    rootDir,
    defaultScope: globalScope,
    mainFileOnly: options?.mainFileOnly ?? false
  });

  if (options?.showAST) {
    console.log('/* AST */');
    ast.forEach((n) => console.log(n));
  }

  const minify = options?.minify ?? false;
  const result = generateCode(ast, { minify });

  return { result, ast };
}

export { lex, parse, generateCode };
