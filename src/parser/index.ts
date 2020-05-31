import * as T from '../types';
import { TokenTracker, Scope } from './utils';
import { parseIdentifier } from './identifier';
import { parsePrimitive } from './primitives';
import { parseTypeLiteral } from './type-literal';
import { parseListLiteral } from './composite-literals';
import { parseThisLiteral } from './this-literal';
import { parseRecordDeclaration } from './record/declaration';
import { parseRecordReferenceExpr } from './record/reference';
import { parseVarDeclaration } from './variable-declaration';
import { parseFunctionDeclaration, parseMethodDeclaration } from './function';
import { parseConditionalExpr } from './conditional';
import { parseAssignmentExpr } from './assignment';
import { parseLogicalNotExpr, parseLogicalAndOrExpr } from './logical';
import { parsePrioritizedExpr } from './prioritized';
import { parseBinaryOpExpr } from './operation';
import { parseMethodInvokeExpr } from './method/invocation';
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
      if (tt.valueIs('override')) {
        tt.next();

        if (tt.valueIs('def'))
          if (tt.peekIs('builtin-type'))
            return parseMethodDeclaration(tt, parseExpr, scope, { override: true });
          else
            return parseFunctionDeclaration(tt, parseExpr, scope, { override: true });
        ParserError('Keyword `override` should used with `def` to override an existing function declaration');
      }

      if (tt.valueIs('def')) {
        if (tt.peekIs('builtin-type'))
          return parseMethodDeclaration(tt, parseExpr, scope);
        return parseFunctionDeclaration(tt, parseExpr, scope);
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

    if (tt.is('builtin-type'))
      return parseTypeLiteral(tt, parseExpr, scope);

    if (tt.is('ident'))
      return parseIdentifier(tt, parseExpr, scope, prevExpr);

    if (tt.is('lbracket'))
      return parseListLiteral(tt, parseExpr, scope, prevExpr);

    if (tt.is('lparen'))
      return parsePrioritizedExpr(tt, parseExpr, scope, prevExpr);

    if (tt.is('eq'))
      return parseAssignmentExpr(tt, parseExpr, scope, ast.pop() as T.Expr);

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

      if (prevExpr?.type === 'ConditionalExpr') {
        const targetExpr = meta.target as ('condition' | 'expr1' | 'expr2');
        return parseBinaryOpExpr(tt, parseExpr, scope, prevExpr[targetExpr]);
      }

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
