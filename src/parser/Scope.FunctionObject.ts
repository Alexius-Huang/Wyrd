import * as T from '../types';
import { ParserError } from './error';

export default class FunctionObject {
  public patterns: Map<Symbol, T.FunctionPatternInfo> = new Map()

  constructor(public name: string) {}

  public createNewPattern(inputTypes: Array<string>, outputType: string) {
    const inputTypePattern = Symbol.for(inputTypes.join('.'));
    this.patterns.set(inputTypePattern, { returnType: outputType });
  }

  public hasInputPattern(inputTypes: Array<string>) {
    const inputTypePattern = Symbol.for(inputTypes.join('.'));
    return this.patterns.has(inputTypePattern);
  }

  public getPatternInfo(inputTypes: Array<string>): T.FunctionPatternInfo {
    const inputTypePattern = Symbol.for(inputTypes.join('.'));
    const patternInfo = this.patterns.get(inputTypePattern);
    if (patternInfo === undefined)
      ParserError(`Cannot find function \`${this.name}\` with input pattern \`${inputTypes.join('.')}\``);
    return patternInfo;
  }
}
