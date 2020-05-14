// import * as T from '../../types';
import Parameter from './Parameter';
import DT from './DataType';
import { ParserError } from '../error';

export default class FunctionObject {
  public patterns: Pattern[] = [];

  constructor(public name: string) {}

  public createNewPattern(parameter: Parameter, outputType: DT) {
    this.patterns.push(new Pattern(parameter, outputType));
  }

  public matchesParameter(parameter: Parameter) {
    const input = parameter.list;

    EachPattern: for (let i = 0; i < this.patterns.length; i += 1) {
      const p = this.patterns[i].parameter.list;
      if (p.length !== parameter.length) continue EachPattern;

      for (let j = 0; j < p.length; j += 1) {
        if (input[j].isNotEqualTo(p[j])) continue EachPattern;
      }
      return true;
    }
    return false;
  }

  // public getPatternInfo(inputTypes: Parameter): T.FunctionPatternInfo {
  //   const inputTypePattern = Symbol.for(inputTypes.toString());
  //   const patternInfo = this.patterns.get(inputTypePattern);
  //   if (patternInfo === undefined)
  //     ParserError(`Cannot find function \`${this.name}\` with input pattern \`${inputTypes.toString()}\``);
  //   return patternInfo;
  // }
  public getPatternInfo(parameter: Parameter): Pattern {
    const input = parameter.list;

    EachPattern: for (let i = 0; i < this.patterns.length; i += 1) {
      const p = this.patterns[i].parameter.list;
      if (p.length !== parameter.length) continue EachPattern;

      for (let j = 0; j < p.length; j += 1) {
        if (input[j].isNotEqualTo(p[j])) continue EachPattern;
      }
      return this.patterns[i];
    }
    ParserError(`Cannot find function \`${this.name}\` with input pattern \`${parameter.list.map(dt => dt.toString()).join('.')}\``);
  }
}

class Pattern {
  constructor(
    public parameter: Parameter,
    public returnDataType: DT,
  ) {}
}
