import * as fs from 'fs';
import * as path from 'path';
import * as T from './types';
import { lex } from './lexer';
import { parse } from './parser';
import { includeLibrary } from './include-library';
import { Scope } from './parser/utils';
import { generateCode } from './code-generator';
import setupBuiltinOperators from './parser/builtin-operators';

export function compile(options?: T.CompilerOptions): T.CompileResult {
  let content: string, rootDir: string;

  if (options?.program)
    content = options.program;
  else if (options?.entry)
    content = fs.readFileSync(options?.entry, 'utf-8');
  else
    throw new Error('CompilerError: Must provide either the `entry` Wyrd file path or Wyrd program as `program` option');

  if (options?.entry)
    rootDir = path.dirname(options.entry);
  else
    rootDir = options?.dir ?? __dirname;

  /* TODO: Load as library */
  let globalScope = new Scope();
  const listGT = globalScope.declareGenericType('List');
  listGT.declareTypeParameter('element');

  globalScope = includeLibrary('Core', globalScope).scope;

  setupBuiltinOperators(globalScope);

  if (options?.scopeMiddleware)
    globalScope = options.scopeMiddleware(globalScope);

  const tokens = lex(content);
  const { ast } = parse(tokens, {
    rootDir,
    defaultScope: globalScope,
    mainFileOnly: options?.mainFileOnly ?? false
  });

  if (options?.showAST)
    ast.forEach((n) => console.log(n));

  const minify = options?.minify ?? false;
  const result = generateCode(ast, { minify });

  return { result, ast };
}

export { lex, parse, generateCode };
