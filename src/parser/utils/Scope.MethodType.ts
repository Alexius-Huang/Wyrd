import MethodObject from './Scope.MethodObject';

export default class MethodType {
  public methods: Map<string, MethodObject> = new Map();

  constructor(public receiver: string) {}

  public createMethod(name: string): MethodObject {
    const methodObj = new MethodObject(name);
    this.methods.set(name, methodObj);
    return methodObj;
  }
}
