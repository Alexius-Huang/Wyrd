import * as T from '../types';
import { TokenTracker, Scope, DataType as DT } from './utils';
import { parseIdentifier } from './identifier';
import { parsePrimitive } from './primitives';
import { parseTypeLiteral } from './type-literal';
import { parseListLiteral } from './composite-literals';
import { parseThisLiteral } from './this-literal';
import { parseRecordDeclaration, parseRecordReferenceExpr } from './record';
import { parseVarDeclaration } from './assignment';
import { parseFunctionDeclaration } from './function';
import { parseConditionalExpr } from './conditional';
import { parseConstantDeclaration } from './assignment';
import { parseLogicalNotExpr, parseLogicalAndOrExpr } from './logical';
import { parsePrioritizedExpr } from './prioritized';
import { parseBinaryOpExpr } from './operation';
import { parseMethodDeclaration, parseMethodInvokeExpr } from './method';
import { parsePipeOperation } from './pipe-operation';
import { parseLibDirectMethodMapping } from './lib';
import { ParserError } from './error';
import { parseImportExpr } from './import';
import { VoidExpression } from './constants';

export function parse(
  tokens: Array<T.Token>,
  options: {
    rootDir: string,
    defaultScope?: Scope,
    defaultAST?: T.AST,
    mainFileOnly?: boolean,
    isLib?: boolean,
  },
): { ast: T.AST, scope: Scope } {
  const tt = new TokenTracker(tokens);
  let globalAst: T.AST = Array.from(options.defaultAST ?? []);
  let globalScope = options.defaultScope ?? new Scope();
  let isLib = options?.isLib ?? false;

  function parseExpr(prevExpr?: T.Expr, meta?: any): T.Expr {
    const scope: Scope = meta?.scope ?? globalScope;
    const ast: T.AST = meta?.ast ?? globalAst;

    if (tt.is('keyword')) {
      let hasOverrideKeyword = false;
      if (tt.valueIs('override')) {
        hasOverrideKeyword = true;
        tt.next();
        if (tt.isNot('keyword') || tt.valueIsNot('def'))
          ParserError(`Keyword \`override\` should used with \`def\` to override an existing function declaration, instead got token of type \`${tt.type}\``);
      }

      if (tt.valueIs('def')) {
        if (tt.peekIs('builtin-type'))
          return parseMethodDeclaration(tt, parseExpr, scope, { override: hasOverrideKeyword });

        if (tt.peekIs('ident')) {
          if (scope.hasRecord(tt.peek!.value))
            return parseMethodDeclaration(tt, parseExpr, scope, { override: hasOverrideKeyword });
          return parseFunctionDeclaration(tt, parseExpr, scope, { override: hasOverrideKeyword });
        }
        ParserError(`Unhandled token of type \`${tt.peek!.type}\` when ready to parse function or method declaration`);
      }

      if (tt.valueIs('if'))
        return parseConditionalExpr(tt, parseExpr, scope);

      if (tt.valueIs('not'))
        return parseLogicalNotExpr(tt, parseExpr);

      if (tt.valueIsOneOf('and', 'or')) {
        if (prevExpr?.type === 'PrioritizedExpr')
          return parseLogicalAndOrExpr(tt, parseExpr, prevExpr.expr);  
        return parseLogicalAndOrExpr(tt, parseExpr, ast.pop() as T.Expr);
      }

      if (tt.valueIs('this'))
        return parseThisLiteral(tt, scope, prevExpr);

      if (tt.valueIs('mutable'))
        return parseVarDeclaration(tt, parseExpr, scope);

      if (tt.valueIs('record'))
        return parseRecordDeclaration(tt, parseExpr, scope);

      if (tt.valueIs('import')) {
        const { scope: updatedScope, ast: updatedAST } = parseImportExpr(tt, parse, scope, options.rootDir);
        globalScope = updatedScope;
        if (!options.mainFileOnly)
          globalAst = globalAst.concat(updatedAST);
        return VoidExpression;
      }

      ParserError(`Unhandled keyword token with value \`${tt.value}\``);
    }

    if (tt.isOneOf('number', 'string', 'boolean', 'null'))
      return parsePrimitive(tt, parseExpr, scope, prevExpr);

    if (tt.is('builtin-type')) {
      const typeLiteral = parseTypeLiteral(tt, parseExpr, scope);
      if (tt.peekIs('ident')) {
        tt.next();

        if (tt.peekIs('eq'))
          return parseConstantDeclaration(tt, parseExpr, scope, typeLiteral);
        ParserError(`Unhandled token of type \`${tt.type}\``);
      }

      return typeLiteral;
    }

    if (tt.is('ident')) {
      return parseIdentifier(tt, parseExpr, scope, prevExpr);
    }

    if (tt.is('lbracket'))
      return parseListLiteral(tt, parseExpr, scope, prevExpr);

    if (tt.is('lparen'))
      return parsePrioritizedExpr(tt, parseExpr, scope, prevExpr);

    if (tt.is('dot'))
      return parseMethodInvokeExpr(tt, parseExpr, scope, ast.pop() as T.Expr);

    if (tt.is('ref'))
      return parseRecordReferenceExpr(tt, parseExpr, scope, ast.pop() as T.Expr);

    if (tt.is('pipe-op'))
      return parsePipeOperation(tt, parseExpr, scope, ast.pop() as T.Expr);

    if (tt.is('lib-tag')) {
      if (!isLib)
        ParserError('Only library files can be parsed with token of type `lib-tag`, name your Wyrd file with extension `.lib.wyrd` to use lib tags');

      if (tt.valueIs('direct-method-mapping')) {
        globalScope = parseLibDirectMethodMapping(tt, parseExpr, scope);
        return VoidExpression;
      }

      ParserError(`Unhandled library tag \`${tt.value}\``);
    }

    if (scope.hasOperator(tt.value)) {
      if (prevExpr?.type === 'PrioritizedExpr')
        return parseBinaryOpExpr(tt, parseExpr, scope, prevExpr.expr);

      return parseBinaryOpExpr(tt, parseExpr, scope, ast.pop() as T.Expr);
    }

    ParserError(`Unhandled token type of \`${tt.type}\``);
  }

  while (true) {
    if (tt.isNot('newline')) {
      const expr = parseExpr();
      expr.type !== 'VoidExpr' && globalAst.push(expr);
    }

    if (!tt.hasNext()) break;
    tt.next();
  }

  return { ast: globalAst, scope: globalScope };
}
