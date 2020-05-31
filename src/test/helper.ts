import * as Path from 'path';
import * as T from '../types';
import * as fs from 'fs';
import { includeLibrary } from '../include-library';
import { Scope } from '../parser/utils';
import setupBuiltinOperators from '../parser/builtin-operators';
import { compile, lex, parse, generateCode } from '..';

export function FundamentalCompileTest(
  name: string,
  options?: {
    debugParser?: boolean;
    focusedASTIndex?: number;
  },
) {
  const [_, testCaseName] = name.split('/');
  const testSamplePath = Path.join(__dirname, `../samples/${name}`);
  const entry = `${testSamplePath}.wyrd`;
  const dir = Path.dirname(testSamplePath);
  const debugParser = options?.debugParser ?? false;

  let program: string;
  let tokens: Array<T.Token>;
  let ast: T.AST;
  let compiled: string;
  let compilerOptions: T.CompilerOptions | undefined;

  describe(testCaseName.split('-').join(' '), () => {
    beforeAll(async () => {
      const testCase = await import(testSamplePath);
      program = fs.readFileSync(entry, 'utf-8');
      tokens = testCase.tokens;
      ast = testCase.ast;
      compiled = testCase.compiled;
      compilerOptions = testCase.compilerOptions;
    });
  
    it('lexes the program into tokens correctly', () => {
      const result: Array<T.Token> = lex(program);
      expect(result.length).toBe(tokens.length);
      expect(result).toMatchObject(tokens);
    });
  
    it('parses the tokens into AST correctly', () => {
      let globalScope = new Scope();

      const listGT = globalScope.declareGenericType('List');
      listGT.declareTypeParameter('element');
      globalScope = includeLibrary('Core', globalScope).scope;

      setupBuiltinOperators(globalScope);

      if (compilerOptions?.scopeMiddleware)
        globalScope = compilerOptions.scopeMiddleware(globalScope);

      const { ast: result } = parse(tokens, {
        rootDir: dir,
        defaultScope: globalScope,
        mainFileOnly: compilerOptions?.mainFileOnly ?? false
      });
      if (debugParser) {
        const index = options?.focusedASTIndex ?? 0;
        console.log(JSON.stringify(result[index], undefined, 2));
      }
      expect(result.length).toBe(ast.length);
      expect(result).toMatchObject(ast);
    });
  
    it('generates JS code from AST correctly', () => {
      const result = generateCode(ast);
      expect(result).toBe(compiled);
    });
  
    if (!debugParser) {
      it('compiles the Wyrd program into JavaScript code correctly', () => {
        const { result } = compile({ ...compilerOptions, dir, entry });
        expect(result).toBe(compiled);
      });
    }  
  });
}
