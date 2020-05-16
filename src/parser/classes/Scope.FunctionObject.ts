import Parameter from './Parameter';
import DT from './DataType';

export default class FunctionObject {
  public patterns: Pattern[] = [];

  constructor(public name: string) {}

  public createNewPattern(parameter: Parameter, outputType: DT) {
    this.patterns.push(new Pattern(this.name, parameter, outputType));
  }

  public getPatternInfo(parameter: Parameter): Pattern | undefined {
    for (let i = 0; i < this.patterns.length; i += 1) {
      const p = this.patterns[i].parameter;
      if (p.matches(parameter)) return this.patterns[i];
    }

    return undefined;
  }
}

class Pattern {
  public overridenIndex = 0;

  constructor(
    public _name: string,
    public parameter: Parameter,
    public returnDataType: DT,
  ) {}

  get name() {
    return this.overridenIndex === 0 ? this._name : `${this._name}$${this.overridenIndex}`;
  }

  public override() {
    this.overridenIndex++;
  }
}
