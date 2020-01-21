import * as T from "./types";

function CodeGenerateError(msg: string): never {
  throw new Error(`Code Generation Error: ${msg}`);
}

export function generateCode(ast: T.AST): string {
  let result = '';
  let index = 0;

  function genExpr(expr: T.Expr): string {
    if (expr.type === 'NumberLiteral') {
      return expr.value;
    }

    if (expr.type === 'BinaryOpExpr') {
      return codeGenBinaryOpExpr(expr);
    }

    if (expr.type === 'PrioritizedExpr') {
      return codeGenPrioritizedExpr(expr);
    }

    CodeGenerateError(`Unhandled expression of type \`${(expr as T.Expr).type}\``);
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
