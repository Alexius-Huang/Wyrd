import {
  Parameter,
  DataType as DT,
  ScopeVariable as Variable,
  ScopeFunctionObject as FunctionObject,
  ScopeMethodType as MethodType,
  ScopeMethodObject as MethodObject
} from '.';
import { ParserError } from '../error';

export default class Scope {
  public parent: null | Scope = null;
  public children: Map<string, Scope> = new Map();

  constructor(
    public variables: Map<string, Variable> = new Map(),
    public functions: Map<string, FunctionObject> = new Map(),
    public methods: Map<string, MethodType> = new Map(),
  ) {}

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
    const variable: Variable = new Variable(name, type);

    this.variables.set(name, variable);
    return variable;
  }

  public createMutableVariable(name: string, type: DT = DT.Unknown): Variable {
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

  public getFunctionPattern(name: string, parameter: Parameter) {
    const functionObj = this.getFunction(name);
    return functionObj.getPatternInfo(parameter);
  }

  public createFunction(name: string): FunctionObject {
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
    return methodObj.getPatternInfo(parameter);
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

  public createChildScope(name: string): Scope {
    const scope = new Scope();
    this.children.set(name, scope);
    scope.parent = this;
    return scope;
  }
}
