import { lex } from '../lexer/index';
import { parse } from '../parser/index';
import { generateCode } from '../codeGenerator';
import * as T from '../types';

export function FundamentalCompileTest(name: string) {
  const path = `../samples/${name}`;

  let program: string, tokens: Array<T.Token>, ast: T.AST, compiled: string, parseOptions: T.ParseOptions | undefined;
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
    expect(result).toMatchObject(ast);
  });

  it('generates JS code from AST correctly', () => {
    const result = generateCode(ast);
    expect(result).toBe(compiled);
  });
}
