import * as T from "../types";
import TokenTracker from './TokenTracker';
import { parseIdentifier } from './identifier';
import { parsePrimitive } from './primitive-literals';
import { parseListLiteral } from './composite-literals';
import { parseFunctionDeclaration } from './function';
import { parseConditionalExpr } from './condition';
import { parseAssignmentExpr } from './assignment';
import { parseLogicalNotExpr, parseLogicalAndOrExpr } from './logical';
import { parsePrioritizedExpr } from './prioritized';
import { parseBinaryOpExpr } from './operation';
import { ParserError } from './error';
import { BuiltinBinaryOperators } from './constants';

export function parse(
  tokens: Array<T.Token>,
  parseOptions?: T.ParseOptions,
): T.AST {
  const tt = new TokenTracker(tokens);
  const globalAst: T.AST = Array.from(parseOptions?.ast ?? []);
  const globalScope: T.Scope = {
    parentScope: null,
    variables: new Map<string, T.Variable>(parseOptions?.variables ?? new Map()),
    functions: new Map<string, T.FunctionPattern>(parseOptions?.functions ?? new Map()),
  };

  function parseExpr(prevExpr?: T.Expr, meta?: any): T.Expr {
    const scope: T.Scope = meta?.scope ?? globalScope;
    const ast: T.AST = meta?.ast ?? globalAst;

    if (tt.is('keyword')) {
      if (tt.valueIs('def')) {
        return parseFunctionDeclaration(tt, parseExpr, scope);
      }

      if (tt.valueIs('if')) {
        let resultExpr: T.ConditionalExpr;
        resultExpr = parseConditionalExpr(tt, parseExpr);
        return resultExpr;
      }

      if (tt.valueIs('not')) {
        return parseLogicalNotExpr(tt, parseExpr,);
      }

      if (tt.valueIsOneOf('and', 'or')) {
        let resultExpr: T.Expr;
        if (prevExpr?.type === 'PrioritizedExpr') {
          resultExpr = parseLogicalAndOrExpr(tt, parseExpr, prevExpr.expr);
          return resultExpr;
        }
  
        return parseLogicalAndOrExpr(tt, parseExpr, ast.pop() as T.Expr);
      }

      ParserError(`Unhandled keyword token with value \`${tt.value}\``);
    }

    if (tt.isOneOf('number', 'string', 'boolean', 'null')) {
      return parsePrimitive(tt, prevExpr);
    }

    if (tt.is('ident')) {
      return parseIdentifier(tt, parseExpr, scope, prevExpr);
    }

    if (tt.is('lbracket')) {
      return parseListLiteral(tt, parseExpr, scope, prevExpr);
    }

    if (tt.is('lparen')) {
      return parsePrioritizedExpr(tt, parseExpr, scope, prevExpr);
    }

    if (tt.is('eq')) {
      let resultExpr: T.Expr;
      resultExpr = parseAssignmentExpr(tt, parseExpr, scope, ast.pop() as T.Expr);
      return resultExpr;
    }

    if (BuiltinBinaryOperators.has(tt.value)) {
      let resultExpr: T.Expr;
      if (prevExpr?.type === 'PrioritizedExpr') {
        resultExpr = parseBinaryOpExpr(tt, parseExpr, scope, prevExpr.expr);
        return resultExpr;
      }

      if (prevExpr?.type === 'ConditionalExpr') {
        const targetExpr = meta.target as ('condition' | 'expr1' | 'expr2');
        resultExpr = parseBinaryOpExpr(tt, parseExpr, scope, prevExpr[targetExpr]);
        return resultExpr;
      }

      resultExpr = parseBinaryOpExpr(tt, parseExpr, scope, ast.pop() as T.Expr);
      return resultExpr;
    }

    ParserError(`Unhandled token type of \`${tt.type}\``);
  }

  while (true) {
    if (tt.is('newline')) {
      if (!tt.hasNext()) break;
      tt.next();
      continue;
    }

    globalAst.push(parseExpr());
    if (!tt.hasNext()) break;
    tt.next();
  }

  return globalAst;
}
