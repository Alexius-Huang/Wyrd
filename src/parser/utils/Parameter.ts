import DataType from './DataType';
import { ParserError } from '../error';

export default class Parameter {
  public list: DataType[];

  static of(...types: DataType[]) {
    return new Parameter(...types);
  }

  static from(types: DataType[]) {
    return new Parameter(...types);
  }

  static Void() {
    return new Parameter();
  }

  constructor(...types: DataType[]) {
    this.list = types;
  }

  get length() { return this.list.length; }

  public toString() {
    if (this.list.length === 0) return 'Void';
    return this.list.map(dt => dt.toString()).join('.');
  }

  public matches(p: Parameter, receiver?: DataType): boolean {
    const pList = p.list;

    if (pList.length !== this.list.length) return false;

    const typeParameterMap = receiver ? receiver.typeParameterMap : {};
    for (let i = 0; i < this.list.length; i += 1) {
      const required = this.list[i];

      if (required.isGeneric) {
        if (pList[i].isNotEqualTo(typeParameterMap[required.type]))
          return false;
      } else if (required.hasTypeParameters()) {
        if (receiver === undefined)
          ParserError('Receiver cannot be undefined');
        if (pList[i].isNotEqualTo(required.applyTypeParametersFrom(receiver)))
          return false;
      } else if (pList[i].isNotEqualTo(required)) {
        return false;
      }
    }
    return true;
  }
}
