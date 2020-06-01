import DT from './DataType';

type OperatorObjectInitialzeOptions = {
  isNotBuiltin?: boolean;
}

export default class OperatorObject {
  public patterns: OperatorPattern[] = [];
  public patternIndex: number = 0;

  constructor(public name: string) {}

  public createNewPattern(opType1: DT, opType2: DT, outputType: DT, options?: OperatorObjectInitialzeOptions): OperatorPattern {
    const referenceName = this.patternIndex === 0 ? this.name : `${this.name}_${this.patternIndex}`;
    const pattern = new OperatorPattern(referenceName, opType1, opType2, outputType);
    this.patterns.push(pattern);
    this.patternIndex++;

    pattern.isNotBuiltin = options?.isNotBuiltin ?? true;
    return pattern;
  }

  public getPatternInfo(opType1: DT, opType2: DT): OperatorPattern | undefined {
    for (let i = 0; i < this.patterns.length; i += 1) {
      const p = this.patterns[i];
      if (p.opType1.isEqualTo(opType1) && p.opType2.isEqualTo(opType2)) return p;
    }

    return undefined;
  }
}

export class OperatorPattern {
  public overridenIndex = 0;
  public isNotBuiltin = true;

  constructor(
    public _name: string,
    public opType1: DT,
    public opType2: DT,
    public returnDataType: DT,
  ) {}

  get name() {
    return this.overridenIndex === 0 ? this._name : `${this._name}$${this.overridenIndex}`;
  }

  public override() {
    this.overridenIndex++;
  }
}
