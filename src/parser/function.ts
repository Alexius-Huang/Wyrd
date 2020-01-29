import * as T from '../types';
import { ParserError, ParserErrorIf } from './error';

export function parseFunctionDeclaration(
  curTok: T.Token,
  nextToken: () => T.Token,
  parseExpr: (prevExpr?: T.Expr, meta?: any) => T.Expr,
  scope: T.Scope,
): T.FunctionDeclaration {
  curTok = nextToken(); // Skip 'def' keyword

  if (curTok.type !== 'ident')
    ParserError('Function declaration should contain the name of the function');

  const result: T.FunctionDeclaration = {
    type: 'FunctionDeclaration',
    name: curTok.value,
    arguments: [],
    outputType: 'Void',
    body: []
  };
  // TODO: Record name of the function
  curTok = nextToken(); // Skip the function name identifier
  
  const functionalScope: T.Scope = {
    parentScope: scope,
    variables: new Map<string, T.Variable>(),
    functions: new Map<string, T.FunctionPattern>(),
  };

  if (curTok.type as string === 'lparen')
    [curTok, result.arguments] = parseFunctionArguments(curTok, nextToken, functionalScope);

  if (curTok.type as string !== 'colon')
    ParserError(`Expect token of type \`colon\` before the output type of the function declaration: \`${result.name}\``);

  curTok = nextToken();
  if (curTok.type as string !== 'builtin-type')
    ParserError(`Expect an output data-type of the function declaration \`${result.name}\``);
  result.outputType = curTok.value;

  curTok = nextToken();
  if (curTok.type as string === 'arrow') {
    /* Single-line function declaration expression */
    curTok = nextToken();

    ParserErrorIf(curTok.type === 'newline', `Expect function \`${result.name}\` to contain expression that returns type \`${result.outputType}\``)

    while (curTok.type !== 'newline') {
      result.body.push(parseExpr(undefined, { scope: functionalScope, ast: result.body }));
      curTok = nextToken();
    }

    return result;
  } else if (curTok.type as string === 'keyword') {
    if (curTok.value === 'do') {
      parseBlock(curTok, nextToken, parseExpr, functionalScope, result);
      return result;
    }

    ParserError(`Unhandled function declaration where token of keyword ${curTok.value}`);
  }

  ParserError(`Unhandled function declaration where token of type ${curTok.type}`)
}

export function parseFunctionArguments(
  curTok: T.Token,
  nextToken: () => T.Token,
  scope: T.Scope,
): [T.Token, Array<T.Argument>] {
  curTok = nextToken();
  const result: Array<T.Argument> = [];

  while (true) {
    let argument: T.Argument = { ident: '', type: '' };
    if (curTok.type === 'ident') {
      argument.ident = curTok.value;

      curTok = nextToken();
      if (curTok.type as string !== 'colon')
        ParserError('Expect token next to the name of the argument is colon');
      curTok = nextToken();

      if (curTok.type as string !== 'builtin-type')
        ParserError('Expect token next to the colon of the argument declaration is data-type');
      argument.type = curTok.value;
      curTok = nextToken();

      // Setting variable infos from arguments
      // TODO: Handle duplicate argument name case
      result.push(argument);
      scope.variables.set(argument.ident, {
        name: argument.ident,
        isConst: true,
        type: argument.type,
      });

      if (curTok.type as string === 'comma') {
        curTok = nextToken();
        continue;
      }

      if (curTok.type as string === 'rparen') {
        curTok = nextToken();
        break;
      }

      ParserError('Expect token after argument declaration to be comma or right-parenthesis');
    }
  }

  return [curTok, result];
}

export function parseBlock(
  curTok: T.Token,
  nextToken: () => T.Token,
  parseExpr: (prevExpr?: T.Expr, meta?: any) => T.Expr,
  scope: T.Scope,
  prevExpr: T.Expr,
): [T.Token, T.Expr] {
  curTok = nextToken(); // Skip keyword `do`

  ParserErrorIf(curTok.type !== 'newline', 'Invalid to contain any expressions after the `do` keyword');
  curTok = nextToken(); // Skip newline

  if (prevExpr.type === 'FunctionDeclaration') {
    while (!(curTok.type === 'keyword' && curTok.value === 'end')) {
      if (curTok.type === 'newline') {
        curTok = nextToken();
        continue;
      }

      prevExpr.body.push(parseExpr(undefined, { scope, ast: prevExpr.body }));
      curTok = nextToken();
    }

    curTok = nextToken();
    return [curTok, prevExpr];
  }

  ParserError(`Unhandled parsing block-level expression with expression of type \`${prevExpr.type}\``)
}
