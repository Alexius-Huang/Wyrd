import * as T from '../types';
import TokenTracker from './TokenTracker';
import { ParserError, ParserErrorIf } from './error';

export function parseFunctionDeclaration(
  tt: TokenTracker,
  parseExpr: (prevExpr?: T.Expr, meta?: any) => T.Expr,
  scope: T.Scope,
): T.FunctionDeclaration {
  tt.next(); // Skip 'def' keyword

  if (tt.isNot('ident'))
    ParserError('Function declaration should contain the name of the function');

  const result: T.FunctionDeclaration = {
    type: 'FunctionDeclaration',
    name: tt.current.value,
    arguments: [],
    outputType: 'Void',
    body: []
  };
  // TODO: Record name of the function
  tt.next(); // Skip the function name identifier
  
  const functionalScope: T.Scope = {
    parentScope: scope,
    variables: new Map<string, T.Variable>(),
    functions: new Map<string, T.FunctionPattern>(),
  };

  if (tt.is('lparen'))
    result.arguments = parseFunctionArguments(tt, functionalScope);

  if (tt.isNot('colon'))
    ParserError(`Expect token of type \`colon\` before the output type of the function declaration: \`${result.name}\``);

  tt.next();
  if (tt.isNot('builtin-type'))
    ParserError(`Expect an output data-type of the function declaration \`${result.name}\``);
  result.outputType = tt.current.value;

  tt.next();
  if (tt.is('arrow')) {
    /* Single-line function declaration expression */
    tt.next();

    ParserErrorIf(tt.is('newline'), `Expect function \`${result.name}\` to contain expression that returns type \`${result.outputType}\``)

    while (tt.isNot('newline')) {
      result.body.push(parseExpr(undefined, { scope: functionalScope, ast: result.body }));
      tt.next();
    }

    return result;
  } else if (tt.is('keyword')) {
    if (tt.current.value === 'do') {
      parseBlock(tt, parseExpr, functionalScope, result);
      return result;
    }

    ParserError(`Unhandled function declaration where token of keyword ${tt.current.value}`);
  }

  ParserError(`Unhandled function declaration where token of type ${tt.current.type}`)
}

export function parseFunctionArguments(
  tt: TokenTracker,
  scope: T.Scope,
): Array<T.Argument> {
  tt.next();
  const result: Array<T.Argument> = [];

  while (true) {
    let argument: T.Argument = { ident: '', type: '' };
    if (tt.is('ident')) {
      argument.ident = tt.current.value;

      tt.next();
      if (tt.isNot('colon'))
        ParserError('Expect token next to the name of the argument is colon');
      tt.next();

      if (tt.isNot('builtin-type'))
        ParserError('Expect token next to the colon of the argument declaration is data-type');
      argument.type = tt.current.value;
      tt.next();

      // Setting variable infos from arguments
      // TODO: Handle duplicate argument name case
      result.push(argument);
      scope.variables.set(argument.ident, {
        name: argument.ident,
        isConst: true,
        type: argument.type,
      });

      if (tt.is('comma')) {
        tt.next();
        continue;
      }

      if (tt.is('rparen')) {
        tt.next();
        break;
      }

      ParserError('Expect token after argument declaration to be comma or right-parenthesis');
    }
  }

  return result;
}

export function parseBlock(
  tt: TokenTracker,
  parseExpr: (prevExpr?: T.Expr, meta?: any) => T.Expr,
  scope: T.Scope,
  prevExpr: T.Expr,
): T.Expr {
  tt.next(); // Skip keyword `do`

  ParserErrorIf(tt.isNot('newline'), 'Invalid to contain any expressions after the `do` keyword');
  tt.next(); // Skip newline

  if (prevExpr.type === 'FunctionDeclaration') {
    while (!(tt.is('keyword') && tt.current.value === 'end')) {
      if (tt.is('newline')) {
        tt.next();
        continue;
      }

      prevExpr.body.push(parseExpr(undefined, { scope, ast: prevExpr.body }));
      tt.next();
    }

    tt.next();
    return prevExpr;
  }

  ParserError(`Unhandled parsing block-level expression with expression of type \`${prevExpr.type}\``)
}
