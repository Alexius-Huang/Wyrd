import * as T from "../types";
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
  const globalAst: T.AST = parseOptions?.ast ?? [];
  const globalScope: T.Scope = {
    parentScope: null,
    variables: parseOptions?.variables ?? (new Map<string, T.Variable>()),
    functions: parseOptions?.functions ?? (new Map<string, T.FunctionPattern>()),
  };

  let index = 0;
  let curTok = tokens[index];

  function nextToken(): T.Token {
    curTok = tokens[++index];
    return curTok;
  }

  function parseExpr(prevExpr?: T.Expr, meta?: any): T.Expr {
    const scope: T.Scope = meta?.scope ?? globalScope;
    const ast: T.AST = meta?.ast ?? globalAst;

    if (curTok.type === 'keyword') {
      if (curTok.value === 'def') {
        return parseFunctionDeclaration(curTok, nextToken, parseExpr, scope);
      }

      if (curTok.value === 'if') {
        let resultExpr: T.ConditionalExpr;
        [curTok, resultExpr] = parseConditionalExpr(curTok, nextToken, parseExpr);
        return resultExpr;
      }

      if (curTok.value === 'not') {
        return parseLogicalNotExpr();
      }

      if (curTok.value === 'and' || curTok.value === 'or') {
        let resultExpr: T.Expr;
        if (prevExpr?.type === 'PrioritizedExpr') {
          resultExpr = parseLogicalAndOrExpr(prevExpr.expr as T.Expr);
          return resultExpr;
        }
  
        return parseLogicalAndOrExpr(ast.pop() as T.Expr);
      }

      ParserError(`Unhandled keyword token with value \`${curTok.value}\``);
    }

    if (curTok.type === 'number') {
      return parseNumberLiteral(curTok, nextToken, prevExpr);
    }

    if (curTok.type === 'string') {
      return parseStringLiteral(curTok, nextToken, prevExpr);
    }

    if (curTok.type === 'boolean') {
      return parseBooleanLiteral(curTok, nextToken, prevExpr);
    }

    if (curTok.type === 'null') {
      return parseNullLiteral(curTok, nextToken, prevExpr);
    }

    if (curTok.type === 'ident') {
      return parseLiteral(curTok, nextToken, parseExpr, scope, prevExpr);
    }

    if (curTok.type === 'lparen') {
      return parsePrioritizedExpr(curTok, nextToken, parseExpr, scope, prevExpr);
    }

    if (curTok.type === 'eq') {
      let resultExpr: T.Expr;
      [curTok, resultExpr] = parseAssignmentExpr(curTok, nextToken, parseExpr, scope, ast.pop() as T.Expr);
      return resultExpr;
    }

    if (BuiltinBinaryOperators.has(curTok.value)) {
      let resultExpr: T.Expr;
      if (prevExpr?.type === 'PrioritizedExpr') {
        [curTok, resultExpr] = parseBinaryOpExpr(curTok, nextToken, parseExpr, scope, prevExpr.expr as T.Expr);
        return resultExpr;
      }

      if (prevExpr?.type === 'ConditionalExpr') {
        const targetExpr = meta.target as ('condition' | 'expr1' | 'expr2');
        [curTok, resultExpr] = parseBinaryOpExpr(curTok, nextToken, parseExpr, scope, prevExpr[targetExpr] as T.Expr);
        return resultExpr;
      }

      [curTok, resultExpr] = parseBinaryOpExpr(curTok, nextToken, parseExpr, scope, ast.pop() as T.Expr);
      return resultExpr;
    }

    ParserError(`Unhandled token type of \`${curTok.type}\``);
  }

  function parseLogicalNotExpr(): T.Expr {
    let result: T.NotExpr = { type: 'NotExpr', returnType: 'Bool' };
    nextToken();
    result.expr = parseExpr(result);
    return result;
  }

  function parseLogicalAndOrExpr(prevExpr: T.Expr): T.Expr {
    const logicType = curTok.value === 'and' ? 'AndExpr' : 'OrExpr';
    let result: T.AndExpr | T.OrExpr = {
      type: logicType,
      expr1: prevExpr,
      returnType: 'Bool',
    };

    nextToken();
    result.expr2 = parseExpr(result);
    return result;
  }

  while (index < tokens.length) {
    if (curTok.type === 'newline') {
      nextToken();
      continue;
    }

    globalAst.push(parseExpr());
    nextToken();
  }

  return globalAst;
}
