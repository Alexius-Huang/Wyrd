import * as T from '../types';
import * as fs from 'fs';
import * as path from 'path';
import { lex } from '../lexer';
import { TokenTracker, Scope } from './utils';
import { ParserError } from './error';

export function parseImportExpr(
  tt: TokenTracker,
  parse: (
    tokens: Array<T.Token>,
    options: {
      rootDir: string,
      defaultScope?: Scope,
      defaultAST?: T.AST,
      mainFileOnly?: boolean,
    },
  ) => { ast: T.AST, scope: Scope },
  scope: Scope,
  rootDir: string,
): {
  scope: Scope,
  ast: T.AST,
} {
  tt.next(); // skip 'import'

  if (tt.isNot('string'))
    ParserError(`Expect token after \`import\` keyword is \`string\`, instead got token of type: \`${tt.type}\``);
 
  const filePath = path.join(rootDir, tt.value);
  const content = fs.readFileSync(filePath, 'utf-8');
  tt.next(); // skip file path represented by 'string'

  return parse(lex(content), {
    rootDir: path.dirname(filePath),
    defaultScope: scope,
  });
}
