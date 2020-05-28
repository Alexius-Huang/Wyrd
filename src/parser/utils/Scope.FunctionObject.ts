import Parameter from './Parameter';
import DT from './DataType';

export default class FunctionObject {
  public patterns: FunctionPattern[] = [];
  public patternIndex: number = 0;

  constructor(public name: string) {}

  public createNewPattern(parameter: Parameter, outputType: DT): FunctionPattern {
    const referenceName = this.patternIndex === 0 ? this.name : `${this.name}_${this.patternIndex}`;
    const pattern = new FunctionPattern(referenceName, parameter, outputType);
    this.patterns.push(pattern);
    this.patternIndex++;

    return pattern;
  }

  public getPatternInfo(parameter: Parameter): FunctionPattern | undefined {
    for (let i = 0; i < this.patterns.length; i += 1) {
      const p = this.patterns[i].parameter;
      if (p.matches(parameter)) return this.patterns[i];
    }

    return undefined;
  }
}

export class FunctionPattern {
  private overridenIndex = 0;

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
