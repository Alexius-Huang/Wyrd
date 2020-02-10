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

export type FunctionPatternInfo = { returnType: string };
export type FunctionPattern = {
  name: string;
  patterns: Map<Symbol, FunctionPatternInfo>;
  // For instance:
  // Symbol.for('Num.Str') means two parameter with first argument as Num and second argument as Str
};

export type ParseOptions = {
  ast?: AST;
  variables?: Map<string, Variable>;
  functions?: Map<string, FunctionPattern>;
};

/* Builtin unoverridable operator actions */
export type OPActionPair = { returnType: string };
export type OPAction = {
  symbol: string; // symbol of the operator
  actionPairs: Map<Symbol, OPActionPair>;
};

export type Scope = {
  parentScope: null | Scope;
  childScopes: Map<string, Scope>;
  variables: Map<string, Variable>;
  functions: Map<string, FunctionPattern>;
};

export type AST = Array<Expr>;

export type Expr =
  EmptyExpr           |
  BinaryOpExpr        |
  NotExpr             |
  OrExpr              |
  AndExpr             |
  VarDeclaration      |
  VarAssignmentExpr   |
  AssignmentExpr      |
  PrioritizedExpr     |
  ConditionalExpr     |
  FunctionDeclaration |
  FunctionInvokeExpr  |
  MethodInvokeExpr    |
  IdentLiteral        |
  NumberLiteral       |
  StringLiteral       |
  BooleanLiteral      |
  NullLiteral         |
  ListLiteral         |
  TypeLiteral
;

export type EmptyExpr = {
  type: 'EmptyExpr';
  returnType: 'Invalid';
};

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

export type ListLiteral = {
  type: 'ListLiteral';
  values: Array<Expr>;
  elementType: string;
  returnType: string;
};

export type IdentLiteral = {
  type: 'IdentLiteral';
  value: string;
  returnType: string;
};

export type TypeLiteral = {
  type: 'TypeLiteral';
  value: string;
  returnType: 'Void';
};

export type VarDeclaration = {
  type: 'VarDeclaration';
  expr1: IdentLiteral;
  expr2: Expr;
  returnType: 'Void';
};

export type VarAssignmentExpr = {
  type: 'VarAssignmentExpr';
  expr1: IdentLiteral;
  expr2: Expr;
  returnType: 'Void';
}

export type AssignmentExpr = {
  type: 'AssignmentExpr';
  expr1: Expr;
  expr2: Expr;
  returnType: 'Void';
};

export type PrioritizedExpr = {
  type: 'PrioritizedExpr';
  expr: Expr;
  returnType: string;
};

export type ConditionalExpr = {
  type: 'ConditionalExpr';
  condition: Expr;
  expr1: Expr;  // Condition is Truethy
  expr2: Expr; // Condition is Falsey
  returnType: string;
};

export type BinaryOpExpr = {
  type: 'BinaryOpExpr';
  operator: Operator;
  expr1: Expr;
  expr2: Expr;
  returnType: string;
};

export type NotExpr = {
  type: 'NotExpr';
  expr: Expr;
  returnType: 'Bool';
};

export type OrExpr = {
  type: 'OrExpr';
  expr1: Expr;
  expr2: Expr;
  returnType: 'Bool';
};

export type AndExpr = {
  type: 'AndExpr';
  expr1: Expr;
  expr2: Expr;
  returnType: 'Bool';
};

export type Argument = { ident: string; type: string };

export type FunctionDeclaration = {
  type: 'FunctionDeclaration';
  name: string;
  arguments: Array<Argument>;
  outputType: string;
  body: Array<Expr>;
  returnType: 'Void';
};

export type FunctionInvokeExpr = {
  type: 'FunctionInvokeExpr';
  name: string;
  params: Array<Expr>;
  returnType: string;
};

export type MethodPattern = { name: string; inputPattern: string; returnType: string };
export type MethodMappedInfo = { name: string; argCount: number };
export type MethodInvokeExpr = {
  type: 'MethodInvokeExpr';
  name: string;
  receiver: Expr;
  params: Array<Expr>;
  returnType: string;
};
