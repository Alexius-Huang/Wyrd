import { Scope, DataType as DT } from './parser/utils';

export type Token = { type: string; value: string };

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

export interface Operand {
  left: DT;
  right: DT;
  return: DT;
}

export type CompilerOptions = {
  /* Minifies the compile result */
  minify?: boolean;

  /* Program, the program content itself */
  program?: string;

  /* Entry file, or so-called the main file */
  entry?: string;

  /* Targeting direcctory, only effective if `program` option is provided */
  dir?: string;

  /* Compile only the main file without imported file */
  mainFileOnly?: boolean;

  /* Show the parsed AST result */
  showAST?: boolean;

  /* Provide default AST */
  defaultAST?: AST;

  /* Provide scope middleware to configure scope in advance */
  scopeMiddleware?: (scope: Scope) => Scope;
};

export type CompileResult = {
  result: string;
  ast: AST;
};

export type GenericPlacholder = {
  generic: string;
  placeholder: string;
};

export type AST = Array<Expr>;

interface Expression {
  type: string;
  return: DT;
}

export type Expr =
  EmptyExpr
| VoidExpr
| BinaryOpExpr
| NotExpr
| OrExpr
| AndExpr
| AssignmentExpr
| VarDeclaration
| VarAssignmentExpr
| PrioritizedExpr
| ConditionalExpr
| FunctionDeclaration
| FunctionInvokeExpr
| MethodDeclaration
| MethodInvokeExpr
| DoBlockExpr
| IdentLiteral
| NumberLiteral
| StringLiteral
| BooleanLiteral
| NullLiteral
| ListLiteral
| TypeLiteral
| ThisLiteral
| RecordLiteral
| RecordReferenceExpr;

export type ExpressionParsingFunction = (prevExpr?: Expr, meta?: any) => Expr;

// Empty expression signifies the expression is expected not to be empty, hence the return type is invalid
export interface EmptyExpr extends Expression {
  type: 'EmptyExpr';
  return: typeof DT.Invalid;
}

// Void expression signifies the expression can be either not important or replace by other expression
export interface VoidExpr extends Expression {
  type: 'VoidExpr';
  return: typeof DT.Void;
}

export interface NumberLiteral extends Expression {
  type: 'NumberLiteral';
  value: string;
  return: typeof DT.Num;
}

export interface StringLiteral extends Expression {
  type: 'StringLiteral';
  value: string;
  return: typeof DT.Str;
}

export interface BooleanLiteral extends Expression {
  type: 'BooleanLiteral';
  value: 'True' | 'False';
  return: typeof DT.Bool;
}

export interface NullLiteral extends Expression {
  type: 'NullLiteral';
  value: 'Null';
  return: typeof DT.Null;
}

export interface ListLiteral extends Expression {
  type: 'ListLiteral';
  values: Array<Expr>;

  // TODO: Element type can be derived from return since it is replaced by the DataType class
  elementType: DT;
}

export interface IdentLiteral extends Expression {
  type: 'IdentLiteral';
  value: string;
}

export interface TypeLiteral extends Expression {
  type: 'TypeLiteral';
  value: string;
  typeObject: DT;
  return: typeof DT.Void;
}

export interface ThisLiteral extends Expression {
  type: 'ThisLiteral';
  return: DT;
}

export interface VarDeclaration extends Expression {
  type: 'VarDeclaration';
  expr1: IdentLiteral;
  expr2: Expr;
  return: typeof DT.Void;
}

export interface VarAssignmentExpr extends Expression {
  type: 'VarAssignmentExpr';
  expr1: IdentLiteral;
  expr2: Expr;
  return: typeof DT.Void;
}

export interface AssignmentExpr extends Expression {
  type: 'AssignmentExpr';
  expr1: IdentLiteral;
  expr2: Expr;
  return: typeof DT.Void;
}

export interface PrioritizedExpr extends Expression {
  type: 'PrioritizedExpr';
  expr: Expr;
}

export interface ConditionalExpr extends Expression {
  type: 'ConditionalExpr';
  condition: Expr;
  expr1: Expr;  // Condition is Truethy
  expr2: Expr; // Condition is Falsey
}

export interface BinaryOpExpr extends Expression {
  type: 'BinaryOpExpr';
  operator: Operator;
  expr1: Expr;
  expr2: Expr;
}

export interface NotExpr extends Expression {
  type: 'NotExpr';
  expr: Expr;
  return: typeof DT.Bool;
}

export interface OrExpr extends Expression {
  type: 'OrExpr';
  expr1: Expr;
  expr2: Expr;
  return: typeof DT.Bool;
}

export interface AndExpr extends Expression {
  type: 'AndExpr';
  expr1: Expr;
  expr2: Expr;
  return: typeof DT.Bool;
}

export type Argument = { ident: string; type: DT };

export interface FunctionDeclaration extends Expression {
  type: 'FunctionDeclaration';
  name: string;
  arguments: Array<Argument>;
  outputType: DT;
  body: Array<Expr>;
  return: typeof DT.Void;
}

export interface FunctionInvokeExpr extends Expression {
  type: 'FunctionInvokeExpr';
  name: string;
  params: Array<Expr>;
}

export interface MethodDeclaration extends Expression {
  type: 'MethodDeclaration';
  receiverType: DT;
  name: string;
  arguments: Array<Argument>;
  outputType: DT;
  body: Array<Expr>;
  return: typeof DT.Void;
}

export interface MethodInvokeExpr extends Expression {
  type: 'MethodInvokeExpr';
  name: string;
  receiver: Expr;
  isNotBuiltin?: boolean;
  params: Array<Expr>;
}

export type RecordProperty = { name: string; type: DT; };
export type RecordPropertyValue = RecordProperty & { value: Expr };
export interface RecordLiteral extends Expression {
  type: 'RecordLiteral';
  properties: Array<RecordPropertyValue>;
}

export interface RecordReferenceExpr extends Expression {
  type: 'RecordReferenceExpr';
  recordExpr: Expr;
  property: string;
}

export interface DoBlockExpr extends Expression {
  type: 'DoBlockExpr';
  body: Array<Expr>;
}
