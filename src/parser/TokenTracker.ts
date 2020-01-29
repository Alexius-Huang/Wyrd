import * as T from '../types';

export default class TokenTracker {
  private index = 0;
  constructor(public readonly tokens: Array<T.Token>) {}

  get current(): T.Token { return this.tokens[this.index]; }
  get peek(): T.Token | null { return this.tokens[this.index + 1] ?? null }

  public next(): T.Token {
    if (!this.hasNext())
      throw new Error('TokenTracker: Out of bound, there are no tokens left for tracking');

    this.index += 1;    
    return this.current;
  }

  public is(type: string): boolean {
    return this.current.type === type;
  }

  public peekIs(type: string): boolean {
    if (!this.hasNext()) return false;
    return (this.peek as T.Token).type === type;
  }

  public hasNext(): boolean {
    return this.index !== this.tokens.length - 1;
  }
}
