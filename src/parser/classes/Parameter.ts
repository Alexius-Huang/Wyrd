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
    return this.list.map(dt => dt.toString()).join('.');
  }

  public matches(p: Parameter): boolean {
    const pList = p.list;

    if (pList.length !== this.list.length) return false;

    for (let i = 0; i < this.list.length; i += 1) {
      if (pList[i].isNotEqualTo(this.list[i])) return false;
    }
    return true;
  }
}
