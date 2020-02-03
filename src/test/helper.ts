import { lex } from '../lexer/index';
import { parse } from '../parser/index';
import { generateCode } from '../codeGenerator';
import { compile } from '../index';
import * as T from '../types';

export function FundamentalCompileTest(
  name: string,
  options?: {
    debugParser?: boolean;
    focusedASTIndex?: number;
  },
) {
  const path = `../samples/${name}`;
  const debugParser = options?.debugParser ?? false;

  let program: string;
  let tokens: Array<T.Token>;
  let ast: T.AST;
  let compiled: string;
  let parseOptions: T.ParseOptions | undefined;
  beforeAll(async () => {
    const testCase = await import(path);
    program = testCase.program;
    tokens = testCase.tokens;
    ast = testCase.ast;
    compiled = testCase.compiled;
    parseOptions = testCase.parseOptions;
  });

  it('lexes the program into tokens correctly', () => {
    const result: Array<T.Token> = lex(program);
    for (let i = 0; i < tokens.length; i += 1) {
      const [resultToken, expectedToken] = [result[i], tokens[i]];
      expect(resultToken.type).toBe(expectedToken.type);
      expect(resultToken.value).toBe(expectedToken.value);
    }
  });

  it('parses the tokens into AST correctly', () => {
    const result: T.AST = parse(tokens, parseOptions);
    if (debugParser) {
      const index = options?.focusedASTIndex ?? 0;
      console.log(JSON.stringify(result[index], undefined, 2));
    }
    expect(result).toMatchObject(ast);
  });

  it('generates JS code from AST correctly', () => {
    const result = generateCode(ast);
    expect(result).toBe(compiled);
  });

  if (!debugParser) {
    it('compiles the Wyrd program into JavaScript code correctly', () => {
      const result = compile(program, { parseOptions });
      expect(result).toBe(compiled);
    });
  }
}
