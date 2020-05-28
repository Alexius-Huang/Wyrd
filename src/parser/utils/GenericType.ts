export default class GenericType {
  public readonly typeParameters: Array<TypeParameter> = [];
  private typeParameterNames: Set<string> = new Set();

  constructor(public name: string) {}

  public declareTypeParameter(name: string) {
    this.typeParameters.push(new TypeParameter(name, this.typeParameters.length + 1));
    this.typeParameterNames.add(name);
  }
}

class TypeParameter {
  constructor(
    public name: string,
    public order: number
  ) {}

  public toString() { return this.name; }
}
