import * as T from '../types';

export default class Scope {
  public parent: null | Scope = null;
  public children: Map<string, Scope> = new Map();

  constructor(
    public variables: Map<string, T.Variable> = new Map(),
    public functions: Map<string, T.FunctionPattern> = new Map(),
  ) {}
}
