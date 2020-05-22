import { RecordProperty } from '../../types';
import { DataType as DT } from '.';
import { ParserError } from '../error';

export default class Record {
  public properties: Map<string, RecordProperty> = new Map();
  public propertySet: Set<string> = new Set();

  constructor(public name: string) {}

  get type() { return new DT(this.name); }

  public setProperty(type: DT, name: string) {
    if (this.propertySet.has(name))
      ParserError(`Property ${name} in \`${this.name}\` has already been declared`);

    this.propertySet.add(name);
    this.properties.set(name, { type, name });
  }

  public getProperty(name: string): RecordProperty {
    if (this.properties.has(name))
      return this.properties.get(name) as RecordProperty;
    ParserError(`Property \`${name}\` isn't existed in definition of record \`${this.name}\``);
  }
}
