import * as T from "../types";
import TokenTracker from './TokenTracker';
import { parseIdentifier } from './identifier';
import { parsePrimitive } from './primitive-literals';
import { parseListLiteral } from './composite-literals';
import { parseFunctionDeclaration } from './function';
import { parseConditionalExpr } from './condition';
import { parseAssignmentExpr } from './assignment';
import { parseLogicalNotExpr, parseLogicalAndOrExpr } from './logical';
import { parsePrioritizedExpr } from './prioritized';
import { parseBinaryOpExpr } from './operation';
import { ParserError, ParserErrorIf } from './error';
import { BuiltinBinaryOperators, EmptyExpression } from './constants';

export function parse(
  tokens: Array<T.Token>,
  parseOptions?: T.ParseOptions,
): T.AST {
  const tt = new TokenTracker(tokens);
  const globalAst: T.AST = Array.from(parseOptions?.ast ?? []);
  const globalScope: T.Scope = {
    parentScope: null,
    childScopes: new Map<string, T.Scope>(),
    variables: new Map<string, T.Variable>(parseOptions?.variables ?? new Map()),
    functions: new Map<string, T.FunctionPattern>(parseOptions?.functions ?? new Map()),
  };

  function parseExpr(prevExpr?: T.Expr, meta?: any): T.Expr {
    const scope: T.Scope = meta?.scope ?? globalScope;
    const ast: T.AST = meta?.ast ?? globalAst;

    if (tt.is('keyword')) {
      if (tt.valueIs('def'))
        return parseFunctionDeclaration(tt, parseExpr, scope);

      if (tt.valueIs('if'))
        return parseConditionalExpr(tt, parseExpr);

      if (tt.valueIs('not'))
        return parseLogicalNotExpr(tt, parseExpr);

      if (tt.valueIsOneOf('and', 'or')) {
        if (prevExpr?.type === 'PrioritizedExpr')
          return parseLogicalAndOrExpr(tt, parseExpr, prevExpr.expr);  
        return parseLogicalAndOrExpr(tt, parseExpr, ast.pop() as T.Expr);
      }

      if (tt.valueIs('mutable'))
        return parseVarDeclaration(tt, parseExpr, scope);

      ParserError(`Unhandled keyword token with value \`${tt.value}\``);
    }

    if (tt.isOneOf('number', 'string', 'boolean', 'null'))
      return parsePrimitive(tt, prevExpr);

    if (tt.is('ident'))
      return parseIdentifier(tt, parseExpr, scope, prevExpr);

    if (tt.is('lbracket'))
      return parseListLiteral(tt, parseExpr, scope, prevExpr);

    if (tt.is('lparen'))
      return parsePrioritizedExpr(tt, parseExpr, scope, prevExpr);

    if (tt.is('eq'))
      return parseAssignmentExpr(tt, parseExpr, scope, ast.pop() as T.Expr);

    if (BuiltinBinaryOperators.has(tt.value)) {
      if (prevExpr?.type === 'PrioritizedExpr')
        return parseBinaryOpExpr(tt, parseExpr, scope, prevExpr.expr);

      if (prevExpr?.type === 'ConditionalExpr') {
        const targetExpr = meta.target as ('condition' | 'expr1' | 'expr2');
        return parseBinaryOpExpr(tt, parseExpr, scope, prevExpr[targetExpr]);
      }

      return parseBinaryOpExpr(tt, parseExpr, scope, ast.pop() as T.Expr);
    }

    ParserError(`Unhandled token type of \`${tt.type}\``);
  }

  while (true) {
    if (tt.isNot('newline'))
      globalAst.push(parseExpr());
    
    if (!tt.hasNext()) break;
    tt.next();
  }

  return globalAst;
}

function parseVarDeclaration(
  tt: TokenTracker,
  parseExpr: (prevExpr?: T.Expr, meta?: any) => T.Expr,
  scope: T.Scope,
): T.Expr {
  tt.next(); // Skip keyword `mutable`

  ParserErrorIf(
    tt.isNot('ident'),
    `Expect next token to be an \`ident\` to represent the mutable variable's name, got ${tt.type}`
  );
  const varName = tt.value;

  // Check if variable is redeclared before in the current scope
  const { variables } = scope;
  if (variables.has(varName)) {
    const varInfo = variables.get(varName) as T.Variable;

    if (varInfo.isConst) {
      ParserError(`Constant \`${varName}\` cannot be redeclared as variable`);
    } else {
      ParserError(`Variable \`${varName}\` cannot be redeclared again`);
    }
  }

  tt.next(); // Skip the `ident` token which is the name of the variable

  ParserErrorIf(
    tt.isNot('eq'),
    `Expect next token to be \`eq\`, got ${tt.type}`
  );
  tt.next(); // Skip the `eq` token

  const result: T.VarDeclaration = {
    type: 'VarDeclaration',
    expr1: { type: 'IdentLiteral', value: varName, returnType: 'Invalid' },
    expr2: EmptyExpression,
    returnType: 'Void'
  };

  result.expr2 = parseExpr(undefined, { scope });
  const isInvalid = result.expr2.returnType === 'Invalid';
  const isVoid = result.expr2.returnType === 'Void';
  ParserErrorIf(isInvalid || isVoid, `Expect variable \`${varName}\` not declared as type 'Invalid' or 'Void'`);

  result.expr1.returnType = result.expr2.returnType;

  // Add variable's info into current Scope
  const varInfo: T.Variable = {
    name: varName,
    type: result.expr1.returnType,
    isConst: false,
  };
  variables.set(varName, varInfo);

  return result;
}
