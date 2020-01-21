import * as T from "./types";

function CodeGenerateError(msg: string): never {
  throw new Error(`Code Generation Error: ${msg}`);
}

export function generateCode(ast: T.AST): string {
  let result = '';
  let index = 0;

  function genExpr(expr: T.Expr): string {
    switch (expr.type) {
      case 'NumberLiteral':
      case 'IdentLiteral':
        return expr.value;
      case 'AssignmentExpr':
        return codeGenAssignmentExpr(expr);
      case 'BinaryOpExpr':
        return codeGenBinaryOpExpr(expr);
      case 'PrioritizedExpr':
        return codeGenPrioritizedExpr(expr);
      default:
        CodeGenerateError(`Unhandled expression of type \`${(expr as T.Expr).type}\``);
    }
  }

  function codeGenBinaryOpExpr(expr: T.BinaryOpExpr) {
    let expr2Result = '';
    if (expr.expr2 === undefined)
      CodeGenerateError('Expect 2nd expression in binary operation');
    else if (expr.expr2.type === 'BinaryOpExpr') {
      expr2Result = `(${genExpr(expr.expr2)})`;
    } else {
      expr2Result = genExpr(expr.expr2);
    }

    return `${genExpr(expr.expr1)} ${expr.operator} ${expr2Result}`;
  }

  function codeGenAssignmentExpr(expr: T.AssignmentExpr) {
    if (expr.expr2 === undefined)
      CodeGenerateError('Expect assignment to have expression to evaluate');
    return `let ${genExpr(expr.expr1)} = ${genExpr(expr.expr2)}`;
  }

  function codeGenPrioritizedExpr(expr: T.PrioritizedExpr) {
    if (expr.expr)
      return `(${genExpr(expr.expr)})`;

    return '()';  
  }

  while (index < ast.length) {
    const expr = ast[index];
    result += `${genExpr(expr)};\n`;
    index++;
  }

  return result;
}
