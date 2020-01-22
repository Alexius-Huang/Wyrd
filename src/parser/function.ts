import * as T from '../types';
import { ParserError } from './error';

export function parseFunctionDeclaration(
  curTok: T.Token,
  nextToken: () => T.Token,
  parseExpr: (prevExpr?: T.Expr) => T.Expr,
): T.FunctionDeclaration {
  curTok = nextToken(); // Skip 'def' keyword

  if (curTok.type !== 'ident')
    ParserError('Function declaration should contain the name of the function');

  const result: T.FunctionDeclaration = {
    type: 'FunctionDeclaration',
    name: curTok.value,
    arguments: [],
    outputType: '',
    body: []
  };
  curTok = nextToken();

  if (curTok.type as string === 'lparen')
    [curTok, result.arguments] = parseFunctionArguments(curTok, nextToken);

  if (curTok.type as string !== 'colon')
    ParserError(`Expect token of type colon before the output type of the function declaration: \`${result.name}\``);

  curTok = nextToken();
  if (curTok.type as string !== 'builtin-type')
    ParserError(`Expect an output data-type of the function declaration \`${result.name}\``);
  result.outputType = curTok.value;

  curTok = nextToken();
  if (curTok.type as string === 'arrow') {
    /* Single-line function declaration expression */
    curTok = nextToken();
    parseExpr(result);

    return result;
  } else if (curTok.type as string === 'keyword') {
    if (curTok.value === 'do') {
      parseBlock(curTok, nextToken, parseExpr, result);
      return result;
    }

    ParserError(`Unhandled function declaration where token of keyword ${curTok.value}`);
  }

  ParserError(`Unhandled function declaration where token of type ${curTok.type}`)
}

export function parseFunctionArguments(
  curTok: T.Token,
  nextToken: () => T.Token,
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

      result.push(argument);
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
  parseExpr: (prevExpr?: T.Expr) => T.Expr,
  prevExpr: T.Expr,
): [T.Token, T.Expr] {
  curTok = nextToken(); // Skip keyword `do`

  if (curTok.type !== 'newline')
    ParserError(`Invalid to contain any expressions after the \`do\` keyword`);
  curTok = nextToken(); // Skip newline

  if (prevExpr.type === 'FunctionDeclaration') {
    while (!(curTok.type === 'keyword' && curTok.value === 'end')) {
      if (curTok.type === 'newline') {
        curTok = nextToken();
        continue;
      }

      parseExpr(prevExpr);
      curTok = nextToken();
    }

    curTok = nextToken();
    return [curTok, prevExpr];
  }

  ParserError(`Unhandled parsing block-level expression with expression of type \`${prevExpr.type}\``)
}
