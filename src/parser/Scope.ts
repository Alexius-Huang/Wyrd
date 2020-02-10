import * as T from '../types';

export default class Scope {
  public parent: null | Scope = null;
  public children: Map<string, Scope> = new Map();

  constructor(
    public variables: Map<string, T.Variable> = new Map(),
    public functions: Map<string, T.FunctionPattern> = new Map(),
  ) {}

  public createConstant(name: string, type: string = 'Unknown'): T.Variable {
    const info: T.Variable = { name, type, isConst: true };

    this.variables.set(name, info);
    return info;
  }

  public createMutableVariable(name: string, type: string = 'Unknown'): T.Variable {
    const info: T.Variable = { name, type, isConst: false };

    this.variables.set(name, info);
    return info;
  }

  public createChildScope(name: string): Scope {
    const scope = new Scope();
    this.children.set(name, scope);
    scope.parent = this;
    return scope;
  }
}
