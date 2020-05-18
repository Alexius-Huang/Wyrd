import * as T from '../../types';
import { TokenTracker, DataType as DT, Scope, Parameter } from '../utils';
import { parseFunctionArguments } from './arguments';
import { parseBlock } from './block';
import { ParserError, ParserErrorIf } from '../error';

export function parseMethodDeclaration(
  tt: TokenTracker,
  parseExpr: (prevExpr?: T.Expr, meta?: any) => T.Expr,
  scope: Scope,
  options?: { override?: Boolean },
): T.MethodDeclaration {
  tt.next(); // Skip 'def' keyword

  ParserErrorIf(
    tt.isNot('builtin-type'),
    `Expect method declaration to have token of type \`type\`, got: ${tt.type}`
  );

  const receiverType = new DT(tt.value);
  tt.next();

  if (tt.isNot('dot'))
    ParserError(`Expect to have token of type \`dot\`, got: ${tt.type}`);
  tt.next();

  if (tt.isNot('ident'))
    ParserError('Method declaration should contain the name of the function');

  const name = tt.value;
  const result: T.MethodDeclaration = {
    type: 'MethodDeclaration',
    receiverType,
    name: `${receiverType.type}_${tt.value}`,
    arguments: [],
    outputType: DT.Void,
    body: [],
    return: DT.Void,
  };

  tt.next(); // Skip the method name identifier

  const methodScope = scope.createChildScope(result.name);
  methodScope.createConstant('this', receiverType);

  /* Arguemnt and parameter parsing */
  if (tt.is('lparen'))
    result.arguments = parseFunctionArguments(tt, methodScope);
  const parameter = Parameter.from(result.arguments.map(arg => arg.type));

  if (tt.isNot('colon'))
    ParserError(`Expect token of type \`colon\` before the output type of the function declaration: \`${result.name}\``);

  tt.next();
  if (tt.isNot('builtin-type'))
    ParserError(`Expect an output data-type of the function declaration \`${result.name}\``);
  result.outputType = new DT(tt.value);

  /* TODO: Check if method is redeclared with same input pattern */
  // if (scope.hasFunction(result.name)) {
  //   const functionObj = scope.getFunction(result.name);
  //   const functionPattern = functionObj.getPatternInfo(parameter);
  //   if (options?.override) {
  //     if (functionPattern === undefined)
  //       ParserError(`Function \`${result.name}\` need not to be override since no input pattern \`${parameter}\` declared`);

  //     functionPattern.override();
  //     result.name = functionPattern.name;
  //   } else {
  //     /* Check if redeclaration */
  //     if (functionPattern !== undefined)
  //       ParserError(`Overriding function \`${result.name}\` with existing input pattern \`${parameter}\`; to override the function, address it with \`override\` keyword before \`def\` token`);

  //     /* Function Overload */
  //     const overloadedPattern = functionObj.createNewPattern(parameter, result.outputType);
  //     result.name = overloadedPattern.name;
  //   }
  // }

  /* Setup a new available pattern for method invocation */
  // else {
    ParserErrorIf(
      options?.override === true,
      `Function \`${result.name}\` need not to be override since no input pattern \`${parameter}\` declared`
    );

    const methodObj = scope.createMethod(receiverType, name);
    methodObj.createNewPattern(parameter, result.outputType);  
  // }

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

    ParserErrorIf(tt.is('newline'), `Expect method \`${receiverType.type}\`.\`${name}\` to contain expression that returns type \`${result.outputType}\``)

    while (tt.isNot('newline')) {
      result.body.push(parseExpr(undefined, { scope: methodScope, ast: result.body }));
      tt.next();
    }
  }
  /* Block-level function declaration expression */
  else if (isDoBlock) {
    parseBlock(tt, parseExpr, methodScope, result);
  }

  /* Check the return type matched with declared output type */
  const lastExpr = result.body[result.body.length - 1];
  ParserErrorIf(
    lastExpr.return.isNotEqualTo(result.outputType),
    `ParserError: Return type of function \`${result.name}\` should be \`${result.outputType}\`, instead got: \`${lastExpr.return}\``
  );
  return result;
}
