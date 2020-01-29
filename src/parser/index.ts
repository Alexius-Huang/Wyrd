import * as T from "../types";
import TokenTracker from './TokenTracker';
import {
  parseLiteral,
  parseNumberLiteral,
  parseStringLiteral,
  parseBooleanLiteral,
  parseNullLiteral,
} from './literal';
import { parseFunctionDeclaration } from './function';
import { parseConditionalExpr } from './condition';
import { parseAssignmentExpr } from './assignment';
import { parsePrioritizedExpr } from './prioritized';
import { parseBinaryOpExpr } from './operation';
import { ParserError } from './error';
import { BuiltinBinaryOperators } from './constants';

export function parse(
  tokens: Array<T.Token>,
  parseOptions?: T.ParseOptions,
): T.AST {
  const tt = new TokenTracker(tokens);
  const globalAst: T.AST = parseOptions?.ast ?? [];
  const globalScope: T.Scope = {
    parentScope: null,
    variables: parseOptions?.variables ?? (new Map<string, T.Variable>()),
    functions: parseOptions?.functions ?? (new Map<string, T.FunctionPattern>()),
  };

  function parseExpr(prevExpr?: T.Expr, meta?: any): T.Expr {
    const scope: T.Scope = meta?.scope ?? globalScope;
    const ast: T.AST = meta?.ast ?? globalAst;

    if (tt.is('keyword')) {
      if (tt.current.value === 'def') {
        return parseFunctionDeclaration(tt, parseExpr, scope);
      }

      if (tt.current.value === 'if') {
        let resultExpr: T.ConditionalExpr;
        resultExpr = parseConditionalExpr(tt, parseExpr);
        return resultExpr;
      }

      if (tt.current.value === 'not') {
        return parseLogicalNotExpr();
      }

      if (tt.current.value === 'and' || tt.current.value === 'or') {
        let resultExpr: T.Expr;
        if (prevExpr?.type === 'PrioritizedExpr') {
          resultExpr = parseLogicalAndOrExpr(prevExpr.expr as T.Expr);
          return resultExpr;
        }
  
        return parseLogicalAndOrExpr(ast.pop() as T.Expr);
      }

      ParserError(`Unhandled keyword token with value \`${tt.current.value}\``);
    }

    if (tt.is('number')) {
      return parseNumberLiteral(tt, prevExpr);
    }

    if (tt.is('string')) {
      return parseStringLiteral(tt, prevExpr);
    }

    if (tt.is('boolean')) {
      return parseBooleanLiteral(tt, prevExpr);
    }

    if (tt.is('null')) {
      return parseNullLiteral(tt, prevExpr);
    }

    if (tt.is('ident')) {
      return parseLiteral(tt, parseExpr, scope, prevExpr);
    }

    if (tt.is('lparen')) {
      return parsePrioritizedExpr(tt, parseExpr, scope, prevExpr);
    }

    if (tt.is('eq')) {
      let resultExpr: T.Expr;
      resultExpr = parseAssignmentExpr(tt, parseExpr, scope, ast.pop() as T.Expr);
      return resultExpr;
    }

    if (BuiltinBinaryOperators.has(tt.current.value)) {
      let resultExpr: T.Expr;
      if (prevExpr?.type === 'PrioritizedExpr') {
        resultExpr = parseBinaryOpExpr(tt, parseExpr, scope, prevExpr.expr as T.Expr);
        return resultExpr;
      }

      if (prevExpr?.type === 'ConditionalExpr') {
        const targetExpr = meta.target as ('condition' | 'expr1' | 'expr2');
        resultExpr = parseBinaryOpExpr(tt, parseExpr, scope, prevExpr[targetExpr] as T.Expr);
        return resultExpr;
      }

      resultExpr = parseBinaryOpExpr(tt, parseExpr, scope, ast.pop() as T.Expr);
      return resultExpr;
    }

    ParserError(`Unhandled token type of \`${tt.current.type}\``);
  }

  function parseLogicalNotExpr(): T.Expr {
    let result: T.NotExpr = { type: 'NotExpr', returnType: 'Bool' };
    tt.next();
    result.expr = parseExpr(result);
    return result;
  }

  function parseLogicalAndOrExpr(prevExpr: T.Expr): T.Expr {
    const logicType = tt.current.value === 'and' ? 'AndExpr' : 'OrExpr';
    let result: T.AndExpr | T.OrExpr = {
      type: logicType,
      expr1: prevExpr,
      returnType: 'Bool',
    };

    tt.next();
    result.expr2 = parseExpr(result);
    return result;
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
