export default class DataType {

  static isList(t: DataType) {
    return t.type === 'List';
  }

  static ListOf(t: DataType) {
    const dt = new DataType('List');
    dt.listOfType = t;
    return dt;
  }

  static Num = new DataType('Num');
  static Str = new DataType('Str');
  static Bool = new DataType('Bool');
  static Null = new DataType('Null');
  static Void = new DataType('Void');
  static Invalid = new DataType('Invalid');
  static Unknown = new DataType('Unknown');

  private listOfType: DataType | undefined = undefined;

  constructor(public type: string) {}

  public toString(): string {
    if (DataType.isList(this)) {
      if (this.listOfType === undefined) throw new Error('Invalid List Data Type');
      return `List[${this.listOfType.toString()}]`;
    }
    return this.type;
  }

  public isEqualTo(otherDT: DataType) {
    return this.toString() === otherDT.toString();
  }

  public isNotEqualTo(otherDT: DataType) {
    return this.toString() !== otherDT.toString();
  }
}
