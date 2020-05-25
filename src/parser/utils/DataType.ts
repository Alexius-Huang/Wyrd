export default class DataType {

  static isList(t: DataType) {
    return t.type === 'List';
  }

  static ListOf(t: DataType, nullable = false) {
    const dt = new DataType('List', nullable);
    dt.listOfType = t;
    return dt;
  }

  static isInvalid(t: DataType) {
    return t.isEqualTo(DataType.Invalid);
  }

  static isVoid(t: DataType) {
    return t.isEqualTo(DataType.Void);
  }

  static Num = new DataType('Num');
  static Str = new DataType('Str');
  static Bool = new DataType('Bool');
  static Null = new DataType('Null');
  static Void = new DataType('Void');
  static Invalid = new DataType('Invalid');
  static Unknown = new DataType('Unknown');

  /* Maybe-types or Nullable-types may contain Null values */
  static Maybe = {
    Num: new DataType('Num', true),
    Str: new DataType('Str', true),
    Bool: new DataType('Bool', true),
  };

  private listOfType: DataType | undefined = undefined;

  constructor(
    public type: string,
    public readonly nullable: boolean = false
  ) {}

  public toString(): string {
    if (DataType.isList(this)) {
      if (this.listOfType === undefined) throw new Error('Invalid List Data Type');
      return `List${this.nullable ? '?' : ''}[${this.listOfType.toString()}]`;
    }
    return this.type + (this.nullable ? '?' : '');
  }

  // For instance, Num is assignable to Maybe Num (or Num?)
  public isAssignableTo(otherDT: DataType) {
    if (this.isEqualTo(DataType.Null))
      return otherDT.nullable;
    return this.type === otherDT.type;
  }

  public isNotAssignableTo(otherDT: DataType) {
    return !this.isAssignableTo(otherDT);
  }

  public isEqualTo(otherDT: DataType) {
    return this.toString() === otherDT.toString();
  }

  public isNotEqualTo(otherDT: DataType) {
    return this.toString() !== otherDT.toString();
  }

  public toNullable(): DataType {
    if (DataType.isList(this)) {
      return DataType.ListOf(this.listOfType as DataType, true);
    }
    return new DataType(this.type, true);
  }
}
