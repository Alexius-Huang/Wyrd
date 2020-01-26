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
  Gt = '>',
  GtEq = '>=',
  Lt = '<',
  LtEq = '<=',
  EqEq = '==',
  BangEq = '!=',
  // Caret = '^',
  // Dot = '.',
  // Comma = ',',
  // Underscore = '_'
}

export type Variable = {
  name: string;
  isConst: boolean;
  type: string;
};

/* Builtin unoverridable operator actions */
export type OPActionPair = { returnType: string };
export type OPAction = {
  symbol: string; // symbol of the operator
  actionPairs: Map<Symbol, OPActionPair>;
};

export type Scope = {
  parentScope: null | Scope;
  variables: Map<string, Variable>;
};

export type AST = Array<Expr>;

export type Expr =
  BinaryOpExpr        |
  NotExpr             |
  OrExpr              |
  AndExpr             |
  AssignmentExpr      |
  PrioritizedExpr     |
  ConditionalExpr     |
  FunctionDeclaration |
  IdentLiteral        |
  NumberLiteral       |
  StringLiteral       |
  BooleanLiteral      |
  NullLiteral
;

export type NumberLiteral = {
  type: 'NumberLiteral';
  value: string;
  returnType: 'Num';
};

export type StringLiteral = {
  type: 'StringLiteral';
  value: string;
  returnType: 'Str';
};

export type BooleanLiteral = {
  type: 'BooleanLiteral';
  value: 'True' | 'False';
  returnType: 'Bool';
};

export type NullLiteral = {
  type: 'NullLiteral';
  value: 'Null';
  returnType: 'Null';
};

export type IdentLiteral = {
  type: 'IdentLiteral';
  value: string;
  returnType?: string;
};

export type AssignmentExpr = {
  type: 'AssignmentExpr';
  expr1: Expr;
  expr2?: Expr;
}

export type PrioritizedExpr = {
  type: 'PrioritizedExpr';
  expr?: Expr;
  returnType?: string;
};

export type ConditionalExpr = {
  type: 'ConditionalExpr';
  condition?: Expr;
  expr1?: Expr;  // Condition is Truethy
  expr2?: Expr; // Condition is Falsey
}

export type BinaryOpExpr = {
  type: 'BinaryOpExpr';
  operator: Operator;
  expr1: Expr;
  expr2?: Expr;
  returnType?: string;
};

export type NotExpr = {
  type: 'NotExpr';
  expr?: Expr;
  returnType: 'Bool';
}

export type OrExpr = {
  type: 'OrExpr';
  expr1: Expr;
  expr2?: Expr;
  returnType: 'Bool';
}

export type AndExpr = {
  type: 'AndExpr';
  expr1: Expr;
  expr2?: Expr;
  returnType: 'Bool';
}

export type Argument = { ident: string; type: string };

export type FunctionDeclaration = {
  type: 'FunctionDeclaration';
  name: string;
  arguments: Array<Argument>;
  outputType: string;
  body: Array<Expr>;
}
