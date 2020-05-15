import DataType from './DataType';

export default class Variable {
  constructor(
    public name: string,
    public type: DataType,
    public isConst: boolean = true,
  ) {}
}
