import * as T from '../types';
import { TokenTracker, Scope, DataType as DT } from './utils';
import { ParserError } from './error';
import { compare } from './precedence';
import { EmptyExpression } from './constants';

export function parseBinaryOpExpr(
  tt: TokenTracker,
  parseExpr: T.ExpressionParsingFunction,
  scope: Scope,
  prevExpr: T.Expr,
): T.Expr {
  if (prevExpr.type === 'IdentLiteral' && DT.isInvalid(prevExpr.return)) {
    ParserError(`Using the unidentified token \`${prevExpr.value}\``);
  }

  const operator = tt.value as T.Operator;

  if (prevExpr.type === 'BinaryOpExpr') {
    const precedence = compare(prevExpr.operator, operator);

    if (precedence === -1) /* Low level */ {
      prevExpr.expr2 = parseBinaryOpExpr(tt, parseExpr, scope, prevExpr.expr2);
      return prevExpr;
    }
    
    /* Eq or higher level */
    const newNode: T.BinaryOpExpr = {
      type: 'BinaryOpExpr',
      operator,
      expr1: prevExpr,
      expr2: EmptyExpression,
      return: DT.Invalid,
    };

    tt.next();
    parseExpr(newNode, { scope });
    return newNode;
  }

  if (prevExpr.type === 'NotExpr') {
    prevExpr.expr = parseBinaryOpExpr(tt, parseExpr, scope, prevExpr.expr);
    return prevExpr;
  }

  if (prevExpr.type === 'OrExpr' || prevExpr.type === 'AndExpr') {
    prevExpr.expr2 = parseBinaryOpExpr(tt, parseExpr, scope, prevExpr.expr2);
    return prevExpr;
  }

  tt.next();
  const result: T.BinaryOpExpr = {
    type: 'BinaryOpExpr',
    operator,
    expr1: prevExpr,
    expr2: EmptyExpression,
    return: DT.Invalid,
  };

  return parseExpr(result, { scope });
}
