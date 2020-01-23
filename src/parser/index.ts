import * as T from "../types";
import {
  parseLiteral,
  parseNumberLiteral,
  parseStringLiteral,
  parseBooleanLiteral,
  parseNullLiteral,
} from './literal';
import { parseFunctionDeclaration } from './function';
import { parseAssignmentExpr } from './assignment';
import { parsePrioritizedExpr } from './prioritized';
import { parseBinaryOpExpr } from './operation';
import { ParserError } from './error';
import { BuiltinBinaryOperators } from './constants';

export function parse(tokens: Array<T.Token>): T.AST {
  const ast: T.AST = [];

  let index = 0;
  let curTok = tokens[index];

  function nextToken(): T.Token {
    curTok = tokens[++index];
    return curTok;
  }

  function parseExpr(prevExpr?: T.Expr, meta?: any): T.Expr {
    if (curTok.type === 'keyword') {
      if (curTok.value === 'def') {
        return parseFunctionDeclaration(curTok, nextToken, parseExpr);
      }

      if (curTok.value === 'if') {
        return parseConditionalExpr(prevExpr);
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

    if (BuiltinBinaryOperators.has(curTok.value)) {
      let resultExpr: T.Expr;
      if (prevExpr?.type === 'PrioritizedExpr') {
        [curTok, resultExpr] = parseBinaryOpExpr(curTok, nextToken, parseExpr, prevExpr.expr as T.Expr);
        return resultExpr;
      }

      if (prevExpr?.type === 'FunctionDeclaration') {
        [curTok, resultExpr] = parseBinaryOpExpr(curTok, nextToken, parseExpr, prevExpr);
        return resultExpr;
      }

      if (prevExpr?.type === 'ConditionalExpr') {
        const targetExpr = meta.target as ('condition' | 'expr1' | 'expr2');
       [curTok, resultExpr] = parseBinaryOpExpr(curTok, nextToken, parseExpr, prevExpr[targetExpr] as T.Expr);
        return resultExpr;
      }

      [curTok, resultExpr] = parseBinaryOpExpr(curTok, nextToken, parseExpr, ast.pop() as T.Expr);
      return resultExpr;
    }

    ParserError(`Unhandled token type of \`${curTok.type}\``);
  }

  function parseConditionalExpr(prevExpr?: T.Expr): T.Expr {
    nextToken(); // Skip 'if' | 'elif' keyword
    let result: T.ConditionalExpr = { type: 'ConditionalExpr' };

    while (curTok.type !== 'arrow' && curTok.value !== 'then') {
      result.condition = parseExpr(result, { target: 'condition' });
      nextToken();

      if (curTok.type === 'newline')
        ParserError('Expect condition to end followed by arrow `=>` or the `then` keyword');
    }

    if (curTok.value === 'then') {
      nextToken(); // Skip 'then' keyword
      if (curTok.type as string !== 'newline')
        ParserError('Expect no tokens after `then` keyword');
    }

    nextToken(); // Skip '=>' inline-control operator or skip `newline` if using `then block`

    while (curTok.type as string !== 'newline') {
      result.expr1 = parseExpr(result, { target: 'expr1' });
      nextToken();
    }

    nextToken(); // Skip newline

    /* Handle elif is exactly the same as the if expression */
    if (curTok.type as string === 'keyword' && curTok.value as string === 'elif') {
      result.expr2 = parseConditionalExpr();
      return result;
    }

    /* Handle else expression */
    if (curTok.type as string === 'keyword' && curTok.value as string === 'else') {
      nextToken(); // Skip 'else' keyword

      if (curTok.type as string !== 'arrow' && curTok.value as string !== 'then')
        ParserError('Expect else condition to followed by arrow `=>` or the `then` keyword');

      if (curTok.type as string === 'arrow') {
        nextToken(); // Skip 'arrow' keyword

        while (curTok.type as string !== 'newline') {
          result.expr2 = parseExpr(result, { target: 'expr2' });
          nextToken();
        }
      } else if (curTok.value as string === 'then') {
        nextToken(); // Skip 'then' keyword
        if (curTok.type as string === 'newline') {
          nextToken(); // Skip 'newline' token

          while (curTok.type as string !== 'newline') {
            result.expr2 = parseExpr(result, { target: 'expr2' });
            nextToken();
          }

          nextToken(); // Skip 'newline' token
          if (curTok.value as string !== 'end')
            ParserError('Expect `else then` expression to followed by an `end` keyword');

          nextToken(); // Skip 'end' token
          if (curTok.type as string !== 'newline')
            ParserError('Expect no tokens after `end` keyword');
        }
      }
    }

    return result;
  }

  function parseLogicalNotExpr(): T.Expr {
    let result: T.NotExpr = { type: 'NotExpr' };
    nextToken();
    result.expr = parseExpr(result);
    return result;
  }

  function parseLogicalAndOrExpr(prevExpr: T.Expr): T.Expr {
    const logicType = curTok.value === 'and' ? 'AndExpr' : 'OrExpr';
    let result: T.AndExpr | T.OrExpr = {
      type: logicType,
      expr1: prevExpr,
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

    ast.push(parseExpr());
    nextToken();
  }

  return ast;
}
