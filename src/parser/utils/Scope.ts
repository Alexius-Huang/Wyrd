import {
  Parameter,
  DataType as DT,
  GenericType as GT,
  ScopeVariable as Variable,
  ScopeFunctionObject as FunctionObject,
  FunctionPattern,
  ScopeMethodType as MethodType,
  ScopeMethodObject as MethodObject,
  ScopeOperatorObject as OperatorObject,
  OperatorPattern,
  ScopeRecord as Record
} from '.';
import { ParserError } from '../error';
import { GenericPlacholder } from '../../types';

export default class Scope {
  public parent: null | Scope = null;
  public children: Map<string, Scope> = new Map();
  public variables: Map<string, Variable> = new Map();
  public functions: Map<string, FunctionObject> = new Map();
  public methods: Map<string, MethodType> = new Map();
  public operators: Map<string, OperatorObject> = new Map();
  public records: Map<string, Record> = new Map();
  public declaredGenerics: Map<string, GT> = new Map();
  public genericPlacholders: Map<string, GenericPlacholder> = new Map();

  public createChildScope(name: string): Scope {
    const scope = new Scope();
    this.children.set(name, scope);
    scope.parent = this;
    return scope;
  }

  public canBeNamedAs(name: string): boolean {
    return (
      this.hasVariable(name) ||
      this.hasFunction(name) ||
      this.hasRecord(name)
    );
  }

  public hasVariable(name: string): boolean {
    return this.variables.has(name) || (this.parent ? this.parent.hasVariable(name) : false);
  }

  public getVariable(name: string): Variable {
    const varInfo = this.variables.get(name);

    if (varInfo === undefined) {
      if (this.parent === null)
        ParserError(`Variable or Constant \`${name}\` isn't found throughout the scope chain`);
      return this.parent.getVariable(name);
    }
    return varInfo;
  }

  public createConstant(name: string, type: DT = DT.Unknown): Variable {
    if (this.variables.has(name)) {
      const varInfo = this.variables.get(name) as Variable;
      ParserError(`${varInfo.isConst ? 'Constant' : 'Variable'} \`${varInfo.name}\` is already declared with type \`${varInfo.type}\``);
    }

    const variable: Variable = new Variable(name, type);
    this.variables.set(name, variable);
    return variable;
  }

  public createMutableVariable(name: string, type: DT = DT.Unknown): Variable {
    if (this.variables.has(name)) {
      const varInfo = this.variables.get(name) as Variable;
      ParserError(`${varInfo.isConst ? 'Constant' : 'Variable'} \`${varInfo.name}\` is already declared with type \`${varInfo.type}\``);
    }

    const variable: Variable = new Variable(name, type, false);
    this.variables.set(name, variable);
    return variable;
  }

  public hasFunction(name: string): boolean {
    return this.functions.has(name) || (this.parent ? this.parent.hasFunction(name) : false);
  }

  public getFunction(name: string): FunctionObject {
    const functionObj = this.functions.get(name);

    if (functionObj === undefined) {
      if (this.parent === null)
        ParserError(`Function \`${name}\` isn't declared throughout scope chain`);
      return this.parent.getFunction(name);
    }
    return functionObj;
  }

  public getFunctionPattern(name: string, parameter: Parameter): FunctionPattern {
    const functionObj = this.getFunction(name);
    const result = functionObj.getPatternInfo(parameter);
    if (result === undefined)
      ParserError(`Function \`${name}\` with input parameter \`${parameter}\` isn't declared throughout scope chain`);
    return result;
  }

  public createFunction(name: string): FunctionObject {
    if (this.functions.has(name))
      ParserError(`Function object \`${name}\` has already been created in current scope`);
    const functionObj = new FunctionObject(name);
    this.functions.set(name, functionObj);
    return functionObj;
  }

  public hasMethod(receiver: DT, name: string): boolean {
    if (this.methods.has(receiver.type)) {
      const methodType = this.methods.get(receiver.type) as MethodType;
      if (methodType.methods.has(name))
        return true;
    }
    return this.parent ? this.parent.hasMethod(receiver, name) : false;
  }

  public getMethod(receiver: DT, name: string): MethodObject {
    const methodType = this.methods.get(receiver.type);

    if (methodType === undefined) {
      if (this.parent === null)
        ParserError(`Method \`${receiver.type}.${name}\` isn't declared throughout scope chain`);
      return this.parent.getMethod(receiver, name);
    }

    const methodObj = methodType.methods.get(name);
    if (methodObj === undefined) {
      if (this.parent === null)
        ParserError(`Method \`${receiver.type}.${name}\` isn't declared throughout scope chain`);
      return this.parent.getMethod(receiver, name);
    }

    return methodObj;
  }
  
  public getMethodPattern(receiver: DT, name: string, parameter: Parameter) {
    const methodObj = this.getMethod(receiver, name);
    return methodObj.getPatternInfo(receiver, parameter);
  }

  public createMethod(receiver: DT, name: string): MethodObject {
    let methodType: MethodType;
    if (this.methods.has(receiver.type)) {
      methodType = this.methods.get(receiver.type) as MethodType;
    } else {
      // TODO: Support List[T] Type
      methodType = new MethodType(receiver.type);
      this.methods.set(receiver.type, methodType);
    }

    return methodType.createMethod(name);
  }

  public hasOperator(name: string): boolean {
    return this.operators.has(name) || (this.parent ? this.parent.hasOperator(name) : false);
  }

  public getOperator(op: string): OperatorObject {
    const operatorObj = this.operators.get(op);

    if (operatorObj === undefined) {
      if (this.parent === null)
        ParserError(`Operator \`${op}\` isn't declared throughout scope chain`);
      return this.parent.getOperator(op);
    }
    return operatorObj;
  }

  public getOperatorPattern(op: string, opType1: DT, opType2: DT): OperatorPattern | undefined {
    const operatorObj = this.getOperator(op);
    return operatorObj.getPatternInfo(opType1, opType2);
  }

  public createOperator(op: string): OperatorObject {
    const operatorObj = new OperatorObject(op);
    this.operators.set(op, operatorObj);
    return operatorObj;
  }

  public hasRecord(name: string): boolean {
    return this.records.has(name) || (this.parent ? this.parent.hasRecord(name) : false);
  }

  public getRecord(name: string): Record {
    let result = this.records.get(name);
    if (result === undefined) {
      if (this.parent === null)
        ParserError(`Record \`${name}\` isn't declared throughout scope chain`);
      return this.parent.getRecord(name);
    }
    return result;
  }

  public createRecord(name: string): Record {
    if (this.records.has(name))
      ParserError(`Record \`${name}\` is already declared in current scope`)
    const r = new Record(name);
    this.records.set(name, r);
    return r;
  }

  public declareGenericType(name: string): GT {
    const gt = new GT(name);
    this.declaredGenerics.set(name, gt);
    return gt;
  }

  public hasGenericType(name: string): boolean {
    return this.declaredGenerics.has(name) || (this.parent ? this.parent.hasGenericType(name) : false);
  }

  public getGenericType(name: string): GT {
    const result = this.declaredGenerics.get(name);
    if (result === undefined)
      if (this.parent !== null)
        return this.parent.getGenericType(name)
      else 
        ParserError(`\`${name}\` isn't found as generic type throughout scope`);
    return result;
  }

  public createGenericPlaceholder(placeholder: string, name: string): GenericPlacholder {
    const gp = { placeholder, generic: name };
    this.genericPlacholders.set(placeholder, gp);
    return gp;
  }

  public hasGenericPlaceholder(placeholder: string): boolean {
    return this.genericPlacholders.has(placeholder) || (this.parent !== null ? this.parent.hasGenericPlaceholder(placeholder) : false);
  }

  public getGenericPlaceholder(placeholder: string): GenericPlacholder {
    return this.genericPlacholders.get(placeholder) as GenericPlacholder;
  }

  public getGenericTypeFromPlaceholder(placeholder: string): DT {
    const gp = this.getGenericPlaceholder(placeholder);
    return DT.Generic(gp.generic);
  }
}
