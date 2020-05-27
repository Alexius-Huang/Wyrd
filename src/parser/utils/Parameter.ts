import DataType from './DataType';

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

    const genericTypeMap = receiver ? receiver.genericTypeMap : {};
    for (let i = 0; i < this.list.length; i += 1) {
      if (this.list[i].isGeneric) {
        if (pList[i].isNotEqualTo(genericTypeMap[this.list[i].type]))
          return false;
      } else if (pList[i].isNotEqualTo(this.list[i])) {
        return false;
      }
    }
    return true;
  }
}
