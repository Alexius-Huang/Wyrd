import * as T from "./types";
import { compare } from "./precedence";

function ParserError(msg: string): never {
  throw new Error(`Parser: ${msg}`);
}

export function parse(tokens: Array<T.Token>): T.AST {
  const ast: T.AST = [];

  let index = 0;
  let curTok = tokens[index];

  function nextToken() {
    curTok = tokens[++index];
  }

  function parseExpr(prevExpr?: T.Expr): T.Expr {
    if (curTok.type === 'number') {
      return parseNumberLiteral(prevExpr);
    }

    if (curTok.type === 'ident') {
      return parseLiteral(prevExpr);
    }

    if (curTok.type === 'lparen') {
      return parsePrioritizedExpr(prevExpr);
    }

    if (curTok.type === 'eq') {
      return parseAssignmentExpr(ast.pop() as T.Expr);
    }

    if (['+', '-', '*', '/', '%'].indexOf(curTok.value) !== -1) {
      if (prevExpr?.type === 'PrioritizedExpr') {
        return parseBinaryOpExpr(prevExpr.expr as T.Expr);
      }
      return parseBinaryOpExpr(ast.pop() as T.Expr);
    }

    ParserError(`Unhandled token type of \`${curTok.type}\``);
  }

  function parseLiteral(prevExpr?: T.Expr): T.Expr {
    const result: T.IdentLiteral = { type: 'IdentLiteral', value: curTok.value };

    if (prevExpr?.type === 'BinaryOpExpr') {
      prevExpr.expr2 = result;
      return prevExpr;
    }
    if (prevExpr?.type === 'PrioritizedExpr') {
      prevExpr.expr = result;
    }
    return result;
  }

  function parseNumberLiteral(prevExpr?: T.Expr): T.Expr {
    const result: T.NumberLiteral = { type: 'NumberLiteral', value: curTok.value };

    if (prevExpr?.type === 'BinaryOpExpr') {
      prevExpr.expr2 = result;
      return prevExpr;
    }
    if (prevExpr?.type === 'PrioritizedExpr') {
      prevExpr.expr = result;
    }
    return result;
  }

  function parseAssignmentExpr(prevExpr: T.Expr): T.AssignmentExpr {
    nextToken(); // Skip the eq token
    const result: T.AssignmentExpr = {
      type: 'AssignmentExpr',
      expr1: prevExpr,
    };

    result.expr2 = parseExpr();

    return result;
  }

  function parseBinaryOpExpr(prevExpr: T.Expr): T.Expr {
    let operator: T.Operator;
    switch(curTok.value) {
      case '+': operator = T.Operator.Plus; break;
      case '-': operator = T.Operator.Dash; break;
      case '*': operator = T.Operator.Asterisk; break;
      case '/': operator = T.Operator.Slash; break;
      case '%': operator = T.Operator.Percent; break;
      default: ParserError(`Unhandled BinaryOpExpr Operator \`${curTok.value}\``)
    }

    if (prevExpr.type === 'BinaryOpExpr') {
      const precedence = compare(prevExpr.operator, operator);

      if (precedence === -1) /* Low level */ {
        prevExpr.expr2 = parseBinaryOpExpr(prevExpr.expr2 as T.Expr);
        return prevExpr;
      } else /* Eq or higher level */ {
        const newNode: T.BinaryOpExpr = {
          type: 'BinaryOpExpr',
          operator,
          expr1: prevExpr as T.Expr,
        };

        nextToken();
        parseExpr(newNode as T.Expr);
        return newNode;
      }
    }

    if (prevExpr.type === 'AssignmentExpr') {
      prevExpr.expr2 = parseBinaryOpExpr(prevExpr.expr2 as T.Expr);
      return prevExpr;
    }

    nextToken();
    const result: T.BinaryOpExpr = {
      type: 'BinaryOpExpr',
      operator,
      expr1: prevExpr,
    };

    return parseExpr(result) as T.BinaryOpExpr;
  }

  function parsePrioritizedExpr(prevExpr?: T.Expr): T.Expr {
    nextToken(); // Skip the lparen token
    let result: T.PrioritizedExpr = { type: 'PrioritizedExpr' };

    while (true) {
      result.expr = parseExpr(result);
      nextToken();
      if (curTok.type === 'rparen') break;
    }

    if (prevExpr !== undefined) {
      if (prevExpr.type === 'BinaryOpExpr') {
        prevExpr.expr2 = result;
        return prevExpr;
      }

      ParserError(`Unhandled parsing prioritized expression based on expression of type \`${prevExpr.type}\``);
    }

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
