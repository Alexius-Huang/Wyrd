export type Token = {
  type: string;
  value: string;
};

export const enum Precedence {
  High = 1,
  Equal = 0,
  Low = -1,
};

export const enum Operator {
  Plus = '+',
  Dash = '-',
  Asterisk = '*',
  Slash = '/',
  Percent = '%',
  // Lparen = '(',
  // Rparen = ')',
  // Lbracket = '[',
  // Rbracket = ']',
  // Lcurly = '{',
  // Rcurly = '}',
  // Eq = '=',
  // Amp = '&',
  // Pipe = '|',
  // Question = '?',
  // Bang = '!',
  // Sharp = '#',
  // Dollar = '$',
  // At = '@',
  // Wavy = '~',
  // Colon = ':',
  // Semicolon = ';',
  // Gt = '>',
  // Lt = '<',
  // Caret = '^',
  // Dot = '.',
  // Comma = ',',
  // Underscore = '_'
}

export type AST = Array<Expr>;

export type Expr =
  BinaryOpExpr    |
  AssignmentExpr  |
  PrioritizedExpr |
  IdentLiteral    |
  NumberLiteral
;

export type NumberLiteral = {
  type: 'NumberLiteral';
  value: string;
};

export type IdentLiteral = {
  type: 'IdentLiteral';
  value: string;
};

export type AssignmentExpr = {
  type: 'AssignmentExpr';
  expr1: Expr;
  expr2?: Expr;
}

export type PrioritizedExpr = {
  type: 'PrioritizedExpr';
  expr?: Expr;
};

export type BinaryOpExpr = {
  type: 'BinaryOpExpr';
  operator: Operator;
  expr1: Expr;
  expr2?: Expr;
};
