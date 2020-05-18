import DT from './DataType';
import Parameter from './Parameter';

type MethodObjectInitialzeOptions = {
  directMapping?: string;
}

export default class MethodObject {
  public patterns: Pattern[] = [];
  public patternIndex: number = 0;

  constructor(public name: string) {}

  public createNewPattern(parameter: Parameter, outputType: DT, options?: MethodObjectInitialzeOptions): Pattern {
    const mappedName = options?.directMapping ?? this.name;
    const referenceName = this.patternIndex === 0 ? mappedName : `${mappedName}_${this.patternIndex}`;
    const pattern = new Pattern(referenceName, parameter, outputType);
    this.patterns.push(pattern);
    this.patternIndex++;

    return pattern;
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
