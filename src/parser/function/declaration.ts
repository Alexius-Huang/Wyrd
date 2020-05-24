import * as T from '../../types';
import { TokenTracker, DataType as DT, Scope, Parameter } from '../utils';
import { parseFunctionArguments } from './arguments';
import { parseBlock } from './block';
import { ParserError, ParserErrorIf } from '../error';

export function parseFunctionDeclaration(
  tt: TokenTracker,
  parseExpr: T.ExpressionParsingFunction,
  scope: Scope,
  options?: { override?: Boolean },
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

  tt.next(); // Skip the function name identifier

  const functionalScope = scope.createChildScope(result.name);

  /* Arguemnt and parameter parsing */
  if (tt.is('lparen'))
    result.arguments = parseFunctionArguments(tt, functionalScope);
  const parameter = Parameter.from(result.arguments.map(arg => arg.type));

  if (tt.isNot('colon'))
    ParserError(`Expect token of type \`colon\` before the output type of the function declaration: \`${result.name}\``);

  tt.next();
  if (tt.isNot('builtin-type'))
    ParserError(`Expect an output data-type of the function declaration \`${result.name}\``);
  result.outputType = new DT(tt.value);

  /* Check if function is redeclared with same input pattern */
  if (scope.hasFunction(result.name)) {
    const functionObj = scope.getFunction(result.name);
    const functionPattern = functionObj.getPatternInfo(parameter);
    if (options?.override) {
      if (functionPattern === undefined)
        ParserError(`Function \`${result.name}\` need not to be override since no input pattern \`${parameter}\` declared`);

      functionPattern.override();
      result.name = functionPattern.name;
    } else {
      /* Check if redeclaration */
      if (functionPattern !== undefined)
        ParserError(`Overriding function \`${result.name}\` with existing input pattern \`${parameter}\`; to override the function, address it with \`override\` keyword before \`def\` token`);

      /* Function Overload */
      const overloadedPattern = functionObj.createNewPattern(parameter, result.outputType);
      result.name = overloadedPattern.name;
    }
  }

  /* Setup a new available pattern for function invocation */
  else {
    ParserErrorIf(
      options?.override === true,
      `Function \`${result.name}\` need not to be override since no input pattern \`${parameter}\` declared`
    );

    const functionObj = scope.createFunction(result.name);
    functionObj.createNewPattern(parameter, result.outputType);  
  }

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

  /* Check the return type matched with declared output type */
  const lastExpr = result.body[result.body.length - 1];
  ParserErrorIf(
    lastExpr.return.isNotEqualTo(result.outputType),
    `ParserError: Return type of function \`${result.name}\` should be \`${result.outputType}\`, instead got: \`${lastExpr.return}\``
  );
  return result;
}
