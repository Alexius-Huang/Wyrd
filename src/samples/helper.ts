import * as T from '../types';
import { DataType as DT } from '../parser/utils';

export function Var(name: string, type: DT): T.IdentLiteral {
  return { type: 'IdentLiteral', value: name, return: type };
}

export function NumberLiteral(value: number): T.NumberLiteral {
  return { type: 'NumberLiteral', value: value.toString(), return: DT.Num };
}

export function StringLiteral(value: string): T.StringLiteral {
  return { type: 'StringLiteral', value, return: DT.Str };
}

export function BooleanLiteral(bool: boolean): T.BooleanLiteral {
  return { type: 'BooleanLiteral', value: bool ? 'True' : 'False', return: DT.Bool };
}

export function NullLiteral(): T.NullLiteral {
  return { type: 'NullLiteral', value: 'Null', return: DT.Null };
}

export function prioritize(expr: T.Expr): T.PrioritizedExpr {
  return {
    type: 'PrioritizedExpr',
    return: expr.return,
    expr,
  };
}

export function Arithmetic(
  operand1: number | string | T.Expr,
  op: '+' | '-' | '*' | '/' | '%',
  operand2: number | string | T.Expr,
): T.BinaryOpExpr {
  let operator: T.Operator;
  switch (op) {
    case '+': operator = T.Operator.Plus;     break;
    case '-': operator = T.Operator.Dash;     break;
    case '*': operator = T.Operator.Asterisk; break;
    case '/': operator = T.Operator.Slash;    break;
    case '%': operator = T.Operator.Percent;  break;
  }

  let expr1: T.Expr, expr2: T.Expr;

  if (typeof operand1 === 'number')
    expr1 = NumberLiteral(operand1);
  else if (typeof operand1 === 'string')
    if (operand1 === 'this')
      expr1 = { type: 'ThisLiteral', return: DT.Num };
    else
      expr1 = { type: 'IdentLiteral', value: operand1, return: DT.Num };
  else
    expr1 = operand1;

  if (typeof operand2 === 'number')
    expr2 = NumberLiteral(operand2);
  else if (typeof operand2 === 'string')
    if (operand2 === 'this')
      expr2 = { type: 'ThisLiteral', return: DT.Num };
    else
      expr2 = { type: 'IdentLiteral', value: operand2, return: DT.Num };
  else
    expr2 = operand2;

  return {
    type: 'BinaryOpExpr',
    operator,
    return: DT.Num,
    expr1,
    expr2,
  };
}
