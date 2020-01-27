import * as T from '../types';
import { ParserErrorIf } from './error';

export function parseFunctionInvokeExpr(
  curTok: T.Token,
  nextToken: () => T.Token,
  parseExpr: (prevExpr?: T.Expr, meta?: any) => T.Expr,
  scope: T.Scope,
  prevExpr?: T.Expr,
): T.Expr {
  const { functions } = scope;
  const { name, patterns } = functions.get(curTok.value) as T.FunctionPattern;

  const result: T.FunctionInvokeExpr = {
    type: 'FunctionInvokeExpr',
    name,
    params: [],
    returnType: 'Unknown',
  };

  curTok = nextToken(); // Skip the name of the function

  ParserErrorIf(curTok.type === 'comma', `Expect next token is an expression as parameter of function \`${name}\`, instead got \`comma\``);
  ParseParameters: while (true) {
    let parameterExpr: T.AST = [];

    /* Parsing parameters */
    ParseParameter: while (true) {
      if (curTok.type === 'newline') {
        result.params.push(parameterExpr[0]);
        break ParseParameters;
      }
      if (curTok.type === 'comma') {
        result.params.push(parameterExpr[0]);
        curTok = nextToken();
        break ParseParameter;
      }
      parameterExpr.push(parseExpr(undefined, { scope, ast: parameterExpr }));
      curTok = nextToken();
    }
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
