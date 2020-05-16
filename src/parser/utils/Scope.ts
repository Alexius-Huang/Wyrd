import { Parameter, ScopeVariable as Variable, DataType as DT, ScopeFunctionObject as FunctionObject } from '.';
import { ParserError } from '../error';

export default class Scope {
  public parent: null | Scope = null;
  public children: Map<string, Scope> = new Map();

  constructor(
    public variables: Map<string, Variable> = new Map(),
    public functions: Map<string, FunctionObject> = new Map(),
  ) {}

  public hasVariable(name: string) {
    return this.variables.has(name);
  }

  public getVariable(name: string): Variable {
    const varInfo = this.variables.get(name);

    if (varInfo === undefined)
      ParserError(`Variable or Constant \`${name}\` isn't found in the scope`);
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

  public hasFunction(name: string) {
    return this.functions.has(name);
  }

  public getFunction(name: string): FunctionObject {
    const functionObj = this.functions.get(name);

    if (functionObj === undefined)
      ParserError(`Function \`${name}\` isn't found in the scope`);
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

  public createChildScope(name: string): Scope {
    const scope = new Scope();
    this.children.set(name, scope);
    scope.parent = this;
    return scope;
  }
}
