import * as T from '../types';
import { ParserError } from './error';
import { compare } from './precedence';
import TokenTracker from './TokenTracker';
import { EmptyExpression } from './constants';

export function parseBinaryOpExpr(
  tt: TokenTracker,
  parseExpr: (prevExpr?: T.Expr, meta?: any) => T.Expr,
  scope: T.Scope,
  prevExpr: T.Expr,
): T.Expr {
  let operator: T.Operator;
  switch(tt.value) {
    case '+':  operator = T.Operator.Plus;     break;
    case '-':  operator = T.Operator.Dash;     break;
    case '*':  operator = T.Operator.Asterisk; break;
    case '/':  operator = T.Operator.Slash;    break;
    case '%':  operator = T.Operator.Percent;  break;
    case '>':  operator = T.Operator.Gt;       break;
    case '<':  operator = T.Operator.Lt;       break;
    case '>=': operator = T.Operator.GtEq;     break;
    case '<=': operator = T.Operator.LtEq;     break;
    case '==': operator = T.Operator.EqEq;     break;
    case '!=': operator = T.Operator.BangEq;   break;
    default: ParserError(`Unhandled BinaryOpExpr Operator \`${tt.value}\``)
  }

  if (prevExpr.type === 'BinaryOpExpr') {
    const precedence = compare(prevExpr.operator, operator);

    if (precedence === -1) /* Low level */ {
      prevExpr.expr2 = parseBinaryOpExpr(tt, parseExpr, scope, prevExpr.expr2);
      return prevExpr;
    } else /* Eq or higher level */ {
      const newNode: T.BinaryOpExpr = {
        type: 'BinaryOpExpr',
        operator,
        expr1: prevExpr,
        expr2: EmptyExpression,
        returnType: 'Invalid',
      };

      tt.next();
      parseExpr(newNode, { scope });
      return newNode;
    }
  }

  if (prevExpr.type === 'AssignmentExpr') {
    prevExpr.expr2 = parseBinaryOpExpr(tt, parseExpr, scope, prevExpr.expr2);
    if (prevExpr.expr1.type === 'IdentLiteral') {
      prevExpr.expr1.returnType = prevExpr.expr2.returnType;
      const varName = prevExpr.expr1.value;
      const variableInfo = scope.variables.get(varName) as T.Variable;
      variableInfo.type = prevExpr.expr1.returnType;

      return prevExpr;
    }

    ParserError('Unhandled assignment expression parsing other than assigning to variable');
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
    returnType: 'Invalid',
  };

  return parseExpr(result, { scope });
}

// function parseLogicalAndOrExpr(
//   curTok: T.Token,
//   nextToken: () => T.Token,
//   parseExpr: (prevExpr?: T.Expr) => T.Expr,
//   prevExpr: T.Expr
// ): [T.Token, T.Expr] {
//   const logicType = curTok.value === 'and' ? 'AndExpr' : 'OrExpr';
//   let result: T.AndExpr | T.OrExpr = {
//     type: logicType,
//     expr1: prevExpr,
//   };

//   tt.next();
//   result.expr2 = parseExpr(result);
//   return result];
// }

// function parseLogicalNotExpr(
//   curTok: T.Token,
//   nextT
// ): T.Expr {
//   let result: T.NotExpr = { type: 'NotExpr' };
//   nextToken();
//   result.expr = parseExpr(result);
//   return result;
// }
