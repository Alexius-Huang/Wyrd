import * as T from '../types';
import * as fs from 'fs';
import * as path from 'path';
import { lex } from '../lexer';
import { includeLibrary } from '../include-library';
import { TokenTracker, Scope } from './utils';
import { ParserError } from './error';
import { BuiltinLibs } from './constants';

export function parseImportExpr(
  tt: TokenTracker,
  parse: (
    tokens: Array<T.Token>,
    options: {
      rootDir: string,
      defaultScope?: Scope,
      defaultAST?: T.AST,
      mainFileOnly?: boolean,
      isLib?: boolean,
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
    ParserError(`Expect token after \`import\` keyword is \`file path\` or \`library name\`, instead got token of type: \`${tt.type}\``);

  if (BuiltinLibs.has(tt.value)) {
    const libName = tt.value;
    tt.next();
    return includeLibrary(libName, scope);
  }

  const filePath = path.join(rootDir, tt.value);
  if (!fs.existsSync(filePath))
    ParserError(`Importing unexisted file \`${filePath}\``);
  const isLib = /\.lib\.wyrd/.test(filePath);
  const content = fs.readFileSync(filePath, 'utf-8');
  tt.next(); // skip file path represented by 'string'

  return parse(lex(content), {
    rootDir: path.dirname(filePath),
    defaultScope: scope,
    isLib,
  });
}
