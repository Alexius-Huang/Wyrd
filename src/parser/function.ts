import * as T from '../types';
import { TokenTracker, DataType as DT, Scope, Parameter } from './classes';
import { ParserError, ParserErrorIf } from './error';

export function parseFunctionDeclaration(
  tt: TokenTracker,
  parseExpr: (prevExpr?: T.Expr, meta?: any) => T.Expr,
  scope: Scope,
): T.FunctionDeclaration {
  tt.next(); // Skip 'def' keyword

  if (tt.isNot('ident'))
    ParserError('Function declaration should contain the name of the function');

  const result: T.FunctionDeclaration = {
    type: 'FunctionDeclaration',
    name: tt.value,
    arguments: [],
    outputType: DT.Void,
    body: [],
    return: DT.Void,
  };

  /* TODO: Handle situation of function re-declaration */

  tt.next(); // Skip the function name identifier

  const functionalScope = scope.createChildScope(result.name);

  if (tt.is('lparen'))
    result.arguments = parseFunctionArguments(tt, functionalScope);

  if (tt.isNot('colon'))
    ParserError(`Expect token of type \`colon\` before the output type of the function declaration: \`${result.name}\``);

  tt.next();
  if (tt.isNot('builtin-type'))
    ParserError(`Expect an output data-type of the function declaration \`${result.name}\``);
  result.outputType = new DT(tt.value);

  /* Setup a new available pattern for function invocation */
  const functionObj = scope.createFunction(result.name);
  functionObj.createNewPattern(
    Parameter.from(result.arguments.map(({ type }) => type)),
    result.outputType
  );

  /* Parsing the function declartion expression */
  tt.next();
  const isArrow = tt.is('arrow');
  const isDoBlock = tt.is('keyword') && tt.valueIs('do');

  ParserErrorIf(
    ! (isArrow || isDoBlock),
    `Unhandled function declaration where token of type \`${tt.type}\` and value \`${tt.value}\``
  );

  /* Single-line function declaration expression */
  if (isArrow) {
    tt.next();

    ParserErrorIf(tt.is('newline'), `Expect function \`${result.name}\` to contain expression that returns type \`${result.outputType}\``)

    while (tt.isNot('newline')) {
      result.body.push(parseExpr(undefined, { scope: functionalScope, ast: result.body }));
      tt.next();
    }
  }
  /* Block-level function declaration expression */
  else if (isDoBlock) {
    parseBlock(tt, parseExpr, functionalScope, result);
  }

  return result;
}

export function parseFunctionArguments(
  tt: TokenTracker,
  scope: Scope,
): Array<T.Argument> {
  tt.next();
  const result: Array<T.Argument> = [];

  while (true) {
    let argument: T.Argument = { ident: '', type: DT.Invalid };
    if (tt.is('ident')) {
      argument.ident = tt.value;

      tt.next();
      if (tt.isNot('colon'))
        ParserError('Expect token next to the name of the argument is colon');
      tt.next();

      if (tt.isNot('builtin-type'))
        ParserError('Expect token next to the colon of the argument declaration is data-type');
      argument.type = new DT(tt.value);
      tt.next();

      // Setting variable infos from arguments
      // TODO: Handle duplicate argument name case
      result.push(argument);
      scope.createConstant(argument.ident, argument.type);

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
  scope: Scope,
  prevExpr: T.Expr,
): T.Expr {
  tt.next(); // Skip keyword `do`

  ParserErrorIf(tt.isNot('newline'), 'Invalid to contain any expressions after the `do` keyword');
  tt.next(); // Skip newline

  if (prevExpr.type === 'FunctionDeclaration') {
    while (!(tt.is('keyword') && tt.valueIs('end'))) {
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
