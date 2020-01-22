import * as T from "../types";
import { parseLiteral, parseNumberLiteral } from './literal';
import { parseFunctionDeclaration } from './function';
import { parseAssignmentExpr } from './assignment';
import { parsePrioritizedExpr } from './prioritized';
import { parseBinaryOpExpr } from './operation';
import { ParserError } from './error';

export function parse(tokens: Array<T.Token>): T.AST {
  const ast: T.AST = [];

  let index = 0;
  let curTok = tokens[index];

  function nextToken(): T.Token {
    curTok = tokens[++index];
    return curTok;
  }

  function parseExpr(prevExpr?: T.Expr): T.Expr {
    if (curTok.type === 'keyword') {
      if (curTok.value === 'def') {
        return parseFunctionDeclaration(curTok, nextToken, parseExpr);
      }

      ParserError(`Unhandled keyword token with value \`${curTok.value}\``);
    }

    if (curTok.type === 'number') {
      return parseNumberLiteral(curTok, nextToken, prevExpr);
    }

    if (curTok.type === 'ident') {
      return parseLiteral(curTok, nextToken, prevExpr);
    }

    if (curTok.type === 'lparen') {
      return parsePrioritizedExpr(curTok, nextToken, parseExpr, prevExpr);
    }

    if (curTok.type === 'eq') {
      let resultExpr: T.Expr;
      if (prevExpr?.type === 'FunctionDeclaration') {
        [curTok, resultExpr] = parseAssignmentExpr(curTok, nextToken, parseExpr, prevExpr);
        return resultExpr;
      }

      [curTok, resultExpr] = parseAssignmentExpr(curTok, nextToken, parseExpr, ast.pop() as T.Expr);
      return resultExpr;
    }

    if (['+', '-', '*', '/', '%'].indexOf(curTok.value) !== -1) {
      let resultExpr: T.Expr;
      if (prevExpr?.type === 'PrioritizedExpr') {
        [curTok, resultExpr] = parseBinaryOpExpr(curTok, nextToken, parseExpr, prevExpr.expr as T.Expr);
        return resultExpr;
      }

      if (prevExpr?.type === 'FunctionDeclaration') {
        [curTok, resultExpr] = parseBinaryOpExpr(curTok, nextToken, parseExpr, prevExpr);
        return resultExpr;
      }

      [curTok, resultExpr] = parseBinaryOpExpr(curTok, nextToken, parseExpr, ast.pop() as T.Expr);
      return resultExpr;
    }

    ParserError(`Unhandled token type of \`${curTok.type}\``);
  }

  while (index < tokens.length) {
    if (curTok.type === 'newline') {
      nextToken();
      continue;
    }

    ast.push(parseExpr());
    nextToken();
  }

  return ast;
}
