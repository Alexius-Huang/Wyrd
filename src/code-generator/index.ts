import * as T from '../types';
import { LogicalBinaryOperators } from '../parser/constants';

function CodeGenerateError(msg: string): never {
  throw new Error(`Code Generation Error: ${msg}`);
}

function spaces(n: number) { return ' '.repeat(n); }

export function generateCode(
  ast: T.AST,
  option?: {
    minify?: boolean;
  },
): string {
  let result = '';
  let index = 0;
  let functionLayers = 0;
  const minify = option?.minify ?? false;
  const commaDelimiter = minify ? ',' : ', ';

  function genExpr(expr: T.Expr): string {
    switch (expr.type) {
      case 'NumberLiteral':
      case 'IdentLiteral':
        return expr.value;
      case 'StringLiteral':
        return `'${expr.value}'`;
      case 'BooleanLiteral':
        return expr.value === 'True' ? 'true' : 'false';
      case 'NullLiteral':
        return 'null';
      case 'ListLiteral':
        return codeGenListLiteral(expr);
      case 'NotExpr':
        return codeGenNotExpr(expr);
      case 'AndExpr':
      case 'OrExpr':
        return codeGenAndOrExpr(expr);
      case 'AssignmentExpr':
        return codeGenAssignmentExpr(expr);
      case 'VarDeclaration':
        return codeGenVarDeclaration(expr);
      case 'VarAssignmentExpr':
        return codeGenVarAssignmentExpr(expr);
      case 'BinaryOpExpr':
        return codeGenBinaryOpExpr(expr);
      case 'PrioritizedExpr':
        return codeGenPrioritizedExpr(expr);
      case 'FunctionDeclaration':
        return codeGenFunctionDeclaration(expr);
      case 'FunctionInvokeExpr':
        return codeGenFunctionInvokeExpr(expr);
      case 'MethodInvokeExpr':
        return codeGenMethodInvokeExpr(expr);
      case 'ConditionalExpr':
        return codeGenConditionalExpr(expr);
      default:
        CodeGenerateError(`Unhandled expression of type \`${(expr).type}\``);
    }
  }

  function codeGenListLiteral(expr: T.ListLiteral) {
    const { values } = expr;
    return `[${values.map(genExpr).join(commaDelimiter)}]`;
  }

  function codeGenBinaryOpExpr(expr: T.BinaryOpExpr) {
    let expr2Result = '';
    if (expr.expr2 === undefined)
      CodeGenerateError('Expect 2nd expression in binary operation');
    else if (expr.expr2.type === 'BinaryOpExpr' && !LogicalBinaryOperators.has(expr.operator)) {
      expr2Result = `(${genExpr(expr.expr2)})`;
    } else {
      expr2Result = genExpr(expr.expr2);
    }

    if (expr.operator === T.Operator.EqEq || expr.operator === T.Operator.BangEq) {
      if (minify)
        return `${genExpr(expr.expr1)}${expr.operator}=${expr2Result}`;
      return `${genExpr(expr.expr1)} ${expr.operator}= ${expr2Result}`;
    }

    if (minify)
      return `${genExpr(expr.expr1)}${expr.operator}${expr2Result}`;
    return `${genExpr(expr.expr1)} ${expr.operator} ${expr2Result}`;
  }

  function codeGenNotExpr(expr: T.NotExpr) {
    if (expr.expr === undefined)
      CodeGenerateError('Expect logical Not have expression');
    
    if (expr.expr.type === 'PrioritizedExpr')
      return `!${genExpr(expr.expr)}`;
    return `!(${genExpr(expr.expr)})`;
  }

  function codeGenAndOrExpr(expr: T.AndExpr | T.OrExpr) {
    const logicType = expr.type === 'AndExpr' ? 'And' : 'Or';
    if (expr.expr2 === undefined)
      CodeGenerateError(`Expect logical ${logicType} have expression`);

    const logicOperator = logicType === 'And' ? '&&' : '||';

    if (minify)
      return `${genExpr(expr.expr1)}${logicOperator}${genExpr(expr.expr2)}`;
    return `${genExpr(expr.expr1)} ${logicOperator} ${genExpr(expr.expr2)}`;
  }

  function codeGenAssignmentExpr(expr: T.AssignmentExpr) {
    if (expr.expr2 === undefined)
      CodeGenerateError('Expect assignment to have expression to evaluate');
    if (minify)
      return `const ${genExpr(expr.expr1)}=${genExpr(expr.expr2)}`;
    return `const ${genExpr(expr.expr1)} = ${genExpr(expr.expr2)}`;
  }

  function codeGenVarDeclaration(expr: T.VarDeclaration) {
    if (expr.expr2 === undefined)
      CodeGenerateError('Expect mutable variable declaration to have expression to evaluate');
    if (minify)
      return `let ${expr.expr1.value}=${genExpr(expr.expr2)}`;
    return `let ${expr.expr1.value} = ${genExpr(expr.expr2)}`;
  }

  function codeGenVarAssignmentExpr(expr: T.VarAssignmentExpr) {
    if (expr.expr2 === undefined)
      CodeGenerateError('Expect mutable variable assignment expression to have expression to evaluate');
    if (minify)
      return `${expr.expr1.value}=${genExpr(expr.expr2)}`;
    return `${expr.expr1.value} = ${genExpr(expr.expr2)}`;
  }

  function codeGenPrioritizedExpr(expr: T.PrioritizedExpr) {
    if (expr.expr)
      return `(${genExpr(expr.expr)})`;
    return '()';
  }

  function codeGenFunctionDeclaration(expr: T.FunctionDeclaration) {
    const { name, arguments: args, body } = expr;
    const s = spaces(functionLayers * 2);
    functionLayers++;

    if (args.length === 0) {
      if (minify)
        return `function ${name}(){${codeGenFunctionBody(body, [], 0)}}`;
      return `\
function ${name}() {
${codeGenFunctionBody(body, [], functionLayers * 2)}
${s}}`;
    }

    if (minify)
      return `function ${name}(${codeGenArguments(args)}){${codeGenFunctionBody(body, args, 0)}}`;
    return `\
function ${name}(${codeGenArguments(args)}) {
${codeGenFunctionBody(body, args, functionLayers * 2)}
${s}}`;
  }

  function codeGenArguments(args: Array<T.Argument>) {
    return args.map(({ ident }) => ident).join(commaDelimiter);
  }

  function codeGenFunctionBody(body: Array<T.Expr>, args: Array<T.Argument>, indent: number) {
    let i = 0;
    const result: Array<string> = [];
    if (minify) {
      while (i < body.length) {
        result.push(`${genExpr(body[i])};`);
        i += 1;
      }
  
      const lastIndex = result.length - 1;
      result[lastIndex] = `return ${result[lastIndex]}`;
      functionLayers--;
      return result.join('');
    }

    while (i < body.length) {
      result.push(`${' '.repeat(indent)}${genExpr(body[i])};`);
      i += 1;
    }

    const lastIndex = result.length - 1;
    result[lastIndex] = `${result[lastIndex].slice(0, indent)}return ${result[lastIndex].slice(indent)}`;
    functionLayers--;
    return result.join('\n');
  }

  function codeGenFunctionInvokeExpr(expr: T.FunctionInvokeExpr) {
    const { name, params } = expr;
    return `${name}(${params.map(genExpr).join(commaDelimiter)})`;
  }

  function codeGenMethodInvokeExpr(expr: T.MethodInvokeExpr): string {
    const { name, receiver, params } = expr;
    const args = params.map(genExpr).join(commaDelimiter);
    if (receiver.type === 'MethodInvokeExpr')
      return `${genExpr(receiver)}.${name}(${args})`;
    return `(${genExpr(receiver)}).${name}(${args})`;
  }

  function codeGenConditionalExpr(expr: T.ConditionalExpr) {
    const { condition, expr1, expr2 } = expr;
    if (condition === undefined || expr1 === undefined || expr2 === undefined)
      CodeGenerateError('Missing expressions in `ConditionExpr`');

    let result: string;
    if (minify) {
      result = `${genExpr(condition)}?${genExpr(expr1)}:`;
    } else {
      result = `${genExpr(condition)} ? ${genExpr(expr1)} : `;
    }

    if (expr2.type === 'ConditionalExpr') {
      result += `(${codeGenConditionalExpr(expr2)})`;
    } else if (expr2.type === 'EmptyExpr') {
      result += 'null';
    } else {
      result += genExpr(expr2);
    }
    return result;
  }

  if (minify) {
    while (index < ast.length) {
      const expr = ast[index];
      result += `${genExpr(expr)}`;
      if (result[result.length - 1] !== '}')
        result += ';';
      index++;
    }
  } else {
    while (index < ast.length) {
      const expr = ast[index];
      result += `${genExpr(expr)}`;
  
      if (result[result.length - 1] === '}')
        result += '\n\n';
      else
        result += ';\n';
  
      index++;
    }
  }

  return result;
}
