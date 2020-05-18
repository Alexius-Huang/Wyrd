import * as T from '../../types';
import { NoTokenLeftException } from '../exceptions';

export default class TokenTracker {
  private index = 0;
  constructor(public readonly tokens: Array<T.Token>) {}

  get current(): T.Token { return this.tokens[this.index]; }
  get type(): string { return this.current.type; }
  get value(): string { return this.current.value; }
  get peek(): T.Token | null { return this.tokens[this.index + 1] ?? null }

  public next(): T.Token {
    if (!this.hasNext()) throw NoTokenLeftException;

    this.index += 1;    
    return this.current;
  }

  public is(type: string): boolean {
    return this.current.type === type;
  }

  public valueIs(value: string): boolean {
    return this.current.value === value;
  }

  public peekValueIs(value: string): boolean {
    return this.peek?.value === value;
  }

  public isNot(type: string): boolean {
    return this.current.type !== type;
  }

  public valueIsNot(value: string): boolean {
    return this.current.value !== value;
  }

  public isOneOf(...types: Array<string>): boolean {
    return types.indexOf(this.current.type) !== -1;
  }

  public valueIsOneOf(...values: Array<string>): boolean {
    return values.indexOf(this.current.value) !== -1;
  }

  public peekValueIsOneOf(...values: Array<string>): boolean {
    if (this.peek !== null)
      return values.indexOf(this.peek?.value) !== -1;
    return false;
  }

  public isNotOneOf(...types: Array<string>): boolean {
    return !this.isOneOf(...types);
  }

  public valueIsNotOneOf(...values: Array<string>): boolean {
    return !this.valueIsOneOf(...values);
  }

  public peekIs(type: string): boolean {
    if (!this.hasNext()) return false;
    return (this.peek as T.Token).type === type;
  }

  public hasNext(): boolean {
    return this.index !== this.tokens.length - 1;
  }
}
