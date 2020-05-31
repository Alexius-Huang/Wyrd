import * as T from './types';
import * as fs from 'fs';
import * as path from 'path';
import { lex } from './lexer';
import { parse } from './parser';
import { Scope } from './parser/utils';

export function includeLibrary(name: string, scope: Scope): { ast: T.AST; scope: Scope } {
  const libFile = path.join(__dirname, 'lib', `${name}.wyrd`);
  const content = fs.readFileSync(libFile, 'utf-8');
  const tokens = lex(content);

  return parse(tokens, {
    rootDir: path.dirname(libFile),
    defaultScope: scope,
    isLib: true,
  });
}
