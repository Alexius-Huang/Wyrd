import * as T from '../../types';
import { TokenTracker, DataType as DT, Scope, Parameter } from '../utils';
import { parseFunctionArguments } from './arguments';
import { parseBlock } from './block';
import { ParserError, ParserErrorIf } from '../error';

export function parseMethodDeclaration(
  tt: TokenTracker,
  parseExpr: T.ExpressionParsingFunction,
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
  const compiledName = `${receiverType.type}_${tt.value}`;
  const invokeFormatName = `${receiverType.type}.${tt.value}`;
  const result: T.MethodDeclaration = {
    type: 'MethodDeclaration',
    receiverType,
    name: compiledName,
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
  if (scope.hasMethod(receiverType, name)) {
    const methodObj = scope.getMethod(receiverType, name);
    const methodPattern = methodObj.getPatternInfo(receiverType, parameter);
    if (options?.override) {
      if (methodPattern === undefined)
        ParserError(`method \`${invokeFormatName}\` need not to be override since no input pattern \`${parameter}\` declared`);

      methodPattern.override();
      result.name = `${receiverType}_${methodPattern.name}`;
    } else {
      /* Check if redeclaration */
      if (methodPattern !== undefined)
        ParserError(`Overriding method \`${invokeFormatName}\` with existing input pattern \`${parameter}\`; to override the method, address it with \`override\` keyword before \`def\` token`);

      /* Nethod Overload */
      const overloadedPattern = methodObj.createNewPattern(parameter, result.outputType);
      result.name = `${receiverType}_${overloadedPattern.name}`;
    }
  }

  /* Setup a new available pattern for method invocation */
  else {
    ParserErrorIf(
      options?.override === true,
      `Method \`${invokeFormatName}\` need not to be override since no input pattern \`${parameter}\` declared`
    );

    const methodObj = scope.createMethod(receiverType, name);
    methodObj.createNewPattern(parameter, result.outputType);  
  }

  /* Parsing the function declartion expression */
  tt.next();
  const isArrow = tt.is('arrow');
  const isDoBlock = tt.is('keyword') && tt.valueIs('do');

  ParserErrorIf(
    ! (isArrow || isDoBlock),
    `Unhandled method declaration where token of type \`${tt.type}\` and value \`${tt.value}\``
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
    `ParserError: Return type of method \`${invokeFormatName}\` should be \`${result.outputType}\`, instead got: \`${lastExpr.return}\``
  );
  return result;
}
