export default class Variable {
  constructor(
    public name: string,
    public type: string,
    public isConst: boolean = true,
  ) {}
}
