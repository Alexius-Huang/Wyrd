import DT from './DataType';
import Parameter from './Parameter';

type MethodObjectInitialzeOptions = {
  directMapping?: string;
  isNotBuiltin?: boolean;
}

export default class MethodObject {
  public patterns: MethodPattern[] = [];
  public patternIndex: number = 0;

  constructor(public name: string) {}

  public createNewPattern(parameter: Parameter, outputType: DT, options?: MethodObjectInitialzeOptions): MethodPattern {
    const mappedName = options?.directMapping ?? this.name;
    const isNotBuiltin = options?.isNotBuiltin ?? true;
    const referenceName = this.patternIndex === 0 || !isNotBuiltin ? mappedName : `${mappedName}_${this.patternIndex}`;
    const pattern = new MethodPattern(referenceName, parameter, outputType);
    this.patterns.push(pattern);
    this.patternIndex++;

    pattern.isNotBuiltin = isNotBuiltin;
    return pattern;
  }

  public getPatternInfo(receiver: DT, parameter: Parameter): MethodPattern | undefined {
    for (let i = 0; i < this.patterns.length; i += 1) {
      const p = this.patterns[i].parameter;
      if (p.matches(parameter, receiver)) return this.patterns[i];
    }

    return undefined;
  }
}

export class MethodPattern {
  public overridenIndex = 0;
  public isNotBuiltin = true;

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
