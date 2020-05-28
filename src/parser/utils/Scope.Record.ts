import { RecordProperty } from '../../types';
import { DataType as DT } from '.';
import { ParserError } from '../error';

export default class Record {
  private readonly properties: Map<string, RecordProperty> = new Map();
  public readonly propertySet: Set<string> = new Set();

  constructor(public name: string) {}

  get type() { return new DT(this.name); }

  public setProperty(type: DT, name: string): Record {
    if (this.propertySet.has(name))
      ParserError(`Property \`${name}\` in \`${this.name}\` has already been declared`);

    this.propertySet.add(name);
    this.properties.set(name, { type, name });
    return this;
  }

  public getProperty(name: string): RecordProperty {
    if (this.hasProperty(name))
      return this.properties.get(name) as RecordProperty;
    ParserError(`Property \`${name}\` isn't existed in definition of record \`${this.name}\``);
  }

  public hasProperty(name: string) {
    return this.propertySet.has(name);
  }
}
