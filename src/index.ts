import { lex } from './lexer/index';
import { parse } from './parser/index';
import { generateCode } from './codeGenerator';

export function compile(code: string): string {
  const tokens = lex(code);
  const ast = parse(tokens);
  const result = generateCode(ast);

  return result;
}
