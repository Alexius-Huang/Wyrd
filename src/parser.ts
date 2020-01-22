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
    if (curTok.type === 'keyword') {
      if (curTok.value === 'def') {
        return parseFunctionDeclaration();
      }

      ParserError(`Unhandled keyword token with value ${curTok.value}`);
    }

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
    if (prevExpr?.type === 'FunctionDeclaration') {
      prevExpr.body.push(result);
      return prevExpr;
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
    if (prevExpr?.type === 'FunctionDeclaration') {
      prevExpr.body.push(result);
      return prevExpr;
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

    if (prevExpr.type === 'FunctionDeclaration') {
      const parsedExpr = parseBinaryOpExpr(prevExpr.body.pop() as T.Expr);
      prevExpr.body.push(parsedExpr);
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

      if (prevExpr.type === 'FunctionDeclaration') {
        prevExpr.body.push(result);
        return prevExpr;
      }

      ParserError(`Unhandled parsing prioritized expression based on expression of type \`${prevExpr.type}\``);
    }

    return result;
  }

  function parseFunctionDeclaration(): T.FunctionDeclaration {
    nextToken(); // Skip 'def' keyword

    if (curTok.type !== 'ident')
      ParserError('Function declaration should contain the name of the function');

    const result: T.FunctionDeclaration = {
      type: 'FunctionDeclaration',
      name: curTok.value,
      arguments: [],
      outputType: '',
      body: []
    };
    nextToken();

    if (curTok.type as string === 'lparen')
      result.arguments = parseFunctionArguments();

    if (curTok.type as string !== 'colon')
      ParserError(`Expect token of type colon before the output type of the function declaration: \`${result.name}\``);

    nextToken();
    if (curTok.type as string !== 'builtin-type')
      ParserError(`Expect an output data-type of the function declaration \`${result.name}\``);
    result.outputType = curTok.value;

    nextToken();
    if (curTok.type as string === 'arrow') {
      /* Single-line function declaration expression */
      nextToken();
      parseExpr(result);

      return result;
    }

    ParserError(`Unhandled function declaration where token of type ${curTok.type}`)
  }

  function parseFunctionArguments(): Array<T.Argument> {
    nextToken();
    const result: Array<T.Argument> = [];

    while (true) {
      let argument: T.Argument = { ident: '', type: '' };
      if (curTok.type === 'ident') {
        argument.ident = curTok.value;

        nextToken();
        if (curTok.type as string !== 'colon')
          ParserError('Expect token next to the name of the argument is colon');
        nextToken();

        if (curTok.type as string !== 'builtin-type')
          ParserError('Expect token next to the colon of the argument declaration is data-type');
        argument.type = curTok.value;
        nextToken();

        result.push(argument);
        if (curTok.type as string === 'comma') {
          nextToken();
          continue;
        }

        if (curTok.type as string === 'rparen') {
          nextToken();
          break;
        }

        ParserError('Expect token after argument declaration to be comma or right-parenthesis');
      }
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
