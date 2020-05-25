import * as T from '../types';

function CodeGenerateError(msg: string): never {
  throw new Error(`Code Generation Error: ${msg}`);
}

function spaces(n: number) { return ' '.repeat(n); }

type CodeGenerationResult = { result: string; type: string };

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

  function genExpr(expr: T.Expr): CodeGenerationResult {
    switch (expr.type) {
      case 'NumberLiteral':
      case 'IdentLiteral':
        return { result: expr.value, type: expr.type };
      case 'StringLiteral':
        return { result: `'${expr.value}'`, type: expr.type };
      case 'BooleanLiteral':
        return { result: expr.value === 'True' ? 'true' : 'false', type: expr.type };
      case 'NullLiteral':
        return { result: 'null', type: expr.type };
      case 'ListLiteral':
        return codeGenListLiteral(expr);
      case 'ThisLiteral':
        return { result: '_this', type: expr.type };
      case 'NotExpr':
        return codeGenNotExpr(expr);
      case 'AndExpr':
      case 'OrExpr':
        return codeGenAndOrExpr(expr);
      case 'RecordLiteral':
        return codeGenRecordLiteral(expr);
      case 'RecordReferenceExpr':
        return codeGenRecordReferenceExpr(expr);
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
      case 'MethodDeclaration':
        return codeGenMethodDeclaration(expr);
      case 'MethodInvokeExpr':
        return codeGenMethodInvokeExpr(expr);
      case 'ConditionalExpr':
        return codeGenConditionalExpr(expr);
      case 'DoBlockExpr':
        return codeGenDoBlockExpr(expr);
      case 'VoidExpr':
        console.warn('Code Generation Warning: `VoidExpression` is expected to be avoid during the parsing phase');
        return { result: '', type: 'VoidExpr' };
      default:
        CodeGenerateError(`Unhandled expression of type \`${(expr).type}\``);
    }
  }

  function codeGenListLiteral(expr: T.ListLiteral): CodeGenerationResult {
    const { values } = expr;
    return { result: `[${values.map(v => genExpr(v).result).join(commaDelimiter)}]`, type: 'ListLiteral' };
  }

  const LogicalBinaryOperators = new Set<string>(['>', '<', '>=', '<=', '==', '!=']);
  function codeGenBinaryOpExpr(expr: T.BinaryOpExpr): CodeGenerationResult {
    let expr2Result = '';
    if (expr.expr2 === undefined)
      CodeGenerateError('Expect 2nd expression in binary operation');
    else if (expr.expr2.type === 'BinaryOpExpr' && !LogicalBinaryOperators.has(expr.operator)) {
      expr2Result = `(${genExpr(expr.expr2).result})`;
    } else {
      expr2Result = genExpr(expr.expr2).result;
    }

    if (expr.operator === T.Operator.EqEq || expr.operator === T.Operator.BangEq) {
      if (minify)
        return { result: `${genExpr(expr.expr1).result}${expr.operator}=${expr2Result}`, type: 'BinaryOpExpr' };
      return { result: `${genExpr(expr.expr1).result} ${expr.operator}= ${expr2Result}`, type: 'BinaryOpExpr' };
    }

    if (minify)
      return { result: `${genExpr(expr.expr1).result}${expr.operator}${expr2Result}`, type: 'BinaryOpExpr' };
    return { result: `${genExpr(expr.expr1).result} ${expr.operator} ${expr2Result}`, type: 'BinaryOpExpr'};
  }

  function codeGenNotExpr(expr: T.NotExpr): CodeGenerationResult {
    if (expr.expr === undefined)
      CodeGenerateError('Expect logical Not have expression');
    
    if (expr.expr.type === 'PrioritizedExpr')
      return { result: `!${genExpr(expr.expr).result}`, type: 'NotExpr' };
    return { result: `!(${genExpr(expr.expr).result})`, type: 'NotExpr' };
  }

  function codeGenAndOrExpr(expr: T.AndExpr | T.OrExpr): CodeGenerationResult {
    const logicType = expr.type === 'AndExpr' ? 'And' : 'Or';
    if (expr.expr2 === undefined)
      CodeGenerateError(`Expect logical ${logicType} have expression`);

    const logicOperator = logicType === 'And' ? '&&' : '||';

    if (minify)
      return { result: `${genExpr(expr.expr1).result}${logicOperator}${genExpr(expr.expr2).result}`, type: expr.type };
    return { result: `${genExpr(expr.expr1).result} ${logicOperator} ${genExpr(expr.expr2).result}`, type: expr.type };
  }

  function codeGenRecordLiteral(expr: T.RecordLiteral): CodeGenerationResult {
    const { properties } = expr;
    if (minify) {
      const recordStr = properties.map(({ name, value }) => `${name}:${genExpr(value).result}`).join(',');
      return { result: `{${recordStr}}`, type: 'RecordLiteral' };  
    }

    const recordStr = properties.map(({ name, value }) => `${name}: ${genExpr(value).result}`).join(', ');
    return { result: `{ ${recordStr} }`, type: 'RecordLiteral' };
  }

  function codeGenRecordReferenceExpr(expr: T.RecordReferenceExpr): CodeGenerationResult {
    const { recordExpr, property } = expr;
    return { result: `${genExpr(recordExpr).result}.${property}`, type: 'RecordReferenceExpr' };
  }

  function codeGenAssignmentExpr(expr: T.AssignmentExpr): CodeGenerationResult {
    if (expr.expr2 === undefined)
      CodeGenerateError('Expect assignment to have expression to evaluate');
    if (minify)
      return { result: `const ${genExpr(expr.expr1).result}=${genExpr(expr.expr2).result}`, type: 'AssignmentExpr' };
    return { result: `const ${genExpr(expr.expr1).result} = ${genExpr(expr.expr2).result}`, type: 'AssignmentExpr' };
  }

  function codeGenVarDeclaration(expr: T.VarDeclaration): CodeGenerationResult {
    if (expr.expr2 === undefined)
      CodeGenerateError('Expect mutable variable declaration to have expression to evaluate');
    if (minify)
      return { result: `let ${expr.expr1.value}=${genExpr(expr.expr2).result}`, type: 'VarDeclaration' };
    return { result: `let ${expr.expr1.value} = ${genExpr(expr.expr2).result}`, type: 'VarDeclaration' };
  }

  function codeGenVarAssignmentExpr(expr: T.VarAssignmentExpr): CodeGenerationResult {
    if (expr.expr2 === undefined)
      CodeGenerateError('Expect mutable variable assignment expression to have expression to evaluate');
    if (minify)
      return { result: `${expr.expr1.value}=${genExpr(expr.expr2).result}`, type: 'VarAssignmentExpr' };
    return { result: `${expr.expr1.value} = ${genExpr(expr.expr2).result}`, type: 'VarAssignmentExpr' };
  }

  function codeGenPrioritizedExpr(expr: T.PrioritizedExpr): CodeGenerationResult {
    if (expr.expr)
      return { result: `(${genExpr(expr.expr).result})`, type: 'PrioritizedExpr'};
    return { result: '()', type: 'PrioritizedExpr' };
  }

  function codeGenFunctionDeclaration(expr: T.FunctionDeclaration): CodeGenerationResult {
    const { name, arguments: args, body } = expr;
    const s = spaces(functionLayers * 2);
    functionLayers++;

    if (args.length === 0) {
      if (minify)
        return { result: `function ${name}(){${codeGenFunctionBody(body, [], 0)}}`, type: 'FunctionDeclaration'};
      return { result: `\
function ${name}() {
${codeGenFunctionBody(body, [], functionLayers * 2)}
${s}}`, type: 'FunctionDeclaration'};
    }

    if (minify)
      return { result: `function ${name}(${codeGenArguments(args)}){${codeGenFunctionBody(body, args, 0)}}`, type: 'FunctionDeclaration' };
    return { result: `\
function ${name}(${codeGenArguments(args)}) {
${codeGenFunctionBody(body, args, functionLayers * 2)}
${s}}`, type: 'FunctionDeclaration' };
  }

  function codeGenArguments(args: Array<T.Argument>): string {
    return args.map(({ ident }) => ident).join(commaDelimiter);
  }

  function codeGenFunctionBody(body: Array<T.Expr>, args: Array<T.Argument>, indent: number): string {
    let i = 0;
    const result: Array<string> = [];
    if (minify) {
      while (i < body.length) {
        result.push(`${genExpr(body[i]).result};`);
        i += 1;
      }
  
      const lastIndex = result.length - 1;
      result[lastIndex] = `return ${result[lastIndex]}`;
      functionLayers--;
      return result.join('');
    }

    while (i < body.length) {
      result.push(`${' '.repeat(indent)}${genExpr(body[i]).result};`);
      i += 1;
    }

    const lastIndex = result.length - 1;
    result[lastIndex] = `${result[lastIndex].slice(0, indent)}return ${result[lastIndex].slice(indent)}`;
    functionLayers--;
    return result.join('\n');
  }

  function codeGenFunctionInvokeExpr(expr: T.FunctionInvokeExpr): CodeGenerationResult {
    const { name, params } = expr;
    return { result: `${name}(${params.map(p => genExpr(p).result).join(commaDelimiter)})`, type: 'FunctionInvokeExpr' };
  }

  function codeGenMethodDeclaration(expr: T.MethodDeclaration): CodeGenerationResult {
    const { name, arguments: args, body } = expr;
    const s = spaces(functionLayers * 2);
    functionLayers++;

    if (args.length === 0) {
      if (minify)
        return { result: `function ${name}(_this){${codeGenFunctionBody(body, [], 0)}}`, type: 'MethodDeclaration' };
      return { result: `\
function ${name}(_this) {
${codeGenFunctionBody(body, [], functionLayers * 2)}
${s}}`, type: 'MethodDeclaration' };
    }

    if (minify)
      return { result: `function ${name}(_this,${codeGenArguments(args)}){${codeGenFunctionBody(body, args, 0)}}`, type: 'MethodDeclaration'};
    return { result: `\
function ${name}(_this, ${codeGenArguments(args)}) {
${codeGenFunctionBody(body, args, functionLayers * 2)}
${s}}`, type: 'MethodDeclaration' };
  }

  function codeGenMethodInvokeExpr(expr: T.MethodInvokeExpr): CodeGenerationResult {
    const { name, receiver, params, isNotBuiltin } = expr;
    const args = params.map(p => genExpr(p).result).join(commaDelimiter);

    if (isNotBuiltin) {
      if (params.length === 0)
        return { result: `${name}(${genExpr(receiver).result})`, type: 'MethodInvokeExpr' };

      if (minify)
        return { result: `${name}(${genExpr(receiver).result},${args})`, type: 'MethodInvokeExpr' };
      return { result: `${name}(${genExpr(receiver).result}, ${args})`, type: 'MethodInvokeExpr' };
    }

    if (receiver.type === 'MethodInvokeExpr' || receiver.type === 'FunctionInvokeExpr' || receiver.type === 'IdentLiteral')
      return { result: `${genExpr(receiver).result}.${name}(${args})`, type: 'MethodInvokeExpr' };
    return { result: `(${genExpr(receiver).result}).${name}(${args})`, type: 'MethodInvokeExpr' };
  }

  function codeGenConditionalExpr(expr: T.ConditionalExpr): CodeGenerationResult {
    const { condition, expr1, expr2 } = expr;

    let result: string;
    if (minify) {
      result = `${genExpr(condition).result}?${genExpr(expr1).result}:`;
    } else {
      result = `${genExpr(condition).result} ? ${genExpr(expr1).result} : `;
    }

    if (expr2.type === 'ConditionalExpr') {
      result += `(${codeGenConditionalExpr(expr2).result})`;
    } else if (expr2.type === 'VoidExpr') {
      result += 'null';
    } else {
      result += genExpr(expr2).result;
    }
    return { result, type: 'ConditionalExpr' };
  }

  function codeGenDoBlockExpr(expr: T.DoBlockExpr): CodeGenerationResult {
    const { body } = expr;
    
    if (minify)
      return { result: `(function(){${codeGenFunctionBody(body, [], 0)}})()`, type: 'DoBlockExpr' };
    return { result: `\
(function () {
${codeGenFunctionBody(body, [], 2)}
})()`, type: 'DoBlockExpr' };
  }

  const notRequiredSemicolonSet = new Set([
    'FunctionDeclaration',
    'MethodDeclaration' 
  ]);

  if (minify) {
    while (index < ast.length) {
      const expr = ast[index];
      const generated = genExpr(expr);
      result += `${generated.result}`;
      if (!notRequiredSemicolonSet.has(generated.type))
        result += ';';
      index++;
    }
  } else {
    while (index < ast.length) {
      const expr = ast[index];
      const generated = genExpr(expr);
      result += `${generated.result}`;
  
      if (!notRequiredSemicolonSet.has(generated.type))
        result += ';\n';
      else
        result += '\n\n';
  
      index++;
    }
  }

  return result;
}
