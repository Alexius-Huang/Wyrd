import * as T from '../types';
import { ParserErrorIf } from './error';

export function parseFunctionInvokeExpr(
  curTok: T.Token,
  nextToken: () => T.Token,
  currentToken: () => T.Token,
  parseExpr: (prevExpr?: T.Expr, meta?: any) => T.Expr,
  scope: T.Scope,
  prevExpr?: T.Expr,
): T.FunctionInvokeExpr {
  const { functions } = scope;
  const { name, patterns } = functions.get(curTok.value) as T.FunctionPattern;

  const result: T.FunctionInvokeExpr = {
    type: 'FunctionInvokeExpr',
    name,
    params: [],
    returnType: 'Unknown',
  };

  curTok = nextToken(); // Skip the name of the function

  const hasParenthesesNested = curTok.type === 'lparen';
  if (hasParenthesesNested)
    curTok = nextToken(); // Skip the left parentheses

  ParserErrorIf(curTok.type === 'comma', `Expect next token is an expression as parameter of function \`${name}\`, instead got \`comma\``);
  while (true) {
    let parameterExpr: T.Expr;
    [curTok, parameterExpr] = parseFunctionParameter(curTok, nextToken, currentToken, parseExpr, scope, hasParenthesesNested);
    result.params.push(parameterExpr);

    if (hasParenthesesNested && curTok.type === 'rparen') break;
    if (curTok.type === 'newline') break;

    curTok = nextToken();
  }

  // TODO: remove type annotation when all expression support return type
  const inputParamsTypePattern = result.params
    .map(expr => (expr as T.NumberLiteral).returnType)
    .join('.');
  const inputParamsTypeSymbol = Symbol.for(inputParamsTypePattern);

  ParserErrorIf(
    !patterns.has(inputParamsTypeSymbol),
    `Function \`${name}\` is called with unmatched input pattern \`${inputParamsTypePattern}\``
  );

  const patternInfo = patterns.get(inputParamsTypeSymbol) as T.FunctionPatternInfo;
  result.returnType = patternInfo.returnType;

  return result;
}

function parseFunctionParameter(
  curTok: T.Token,
  nextToken: () => T.Token,
  currentToken: () => T.Token,
  parseExpr: (prevExpr?: T.Expr, meta?: any) => T.Expr,
  scope: T.Scope,
  hasParenthesesNested: boolean,
): [T.Token, T.Expr] {
  const parameterExpr: T.AST = [];

  while (!(curTok.type === 'newline' || curTok.type === 'comma')) {

    const expr = parseExpr(undefined, { scope, ast: parameterExpr });
    parameterExpr.push(expr);

    if (expr.type !== 'FunctionInvokeExpr') {
      curTok = nextToken();

      if (hasParenthesesNested && curTok.type === 'rparen') break;
    } else {
      // If the previous expression is function invoke expression
      // It'll end with either comma or newline already, so we need to update the current token
      // TODO: After implement token tracter, this may be able to refactor
      curTok = currentToken();
    }
  }

  return [curTok, parameterExpr[0]];
}
