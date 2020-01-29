import TokenTracker from '../../parser/TokenTracker';
import * as T from '../../types';

describe('Token Tracker', () => {
  const tokens: Array<T.Token> = [
    { type: 'ident', value: 'foo' },
    { type: 'eq', value: '=' },
    { type: 'number', value: '1' },
    { type: 'plus', value: '+' },
    { type: 'number', value: '2' },
  ];

  let tt: TokenTracker;

  beforeEach(() => {
    tt = new TokenTracker(tokens);
  });

  describe('Initialization', () => {
    it('creates the token tracker which tracks the lexed token', () => {
      expect(tt.tokens).toBe(tokens);
    });
  });

  describe('Accessors', () => {
    describe('TokenTracker#current', () => {
      it('returns the tracked down current token', () => {
        expect(tt.current).toMatchObject({ type: 'ident', value: 'foo' });
      });
    });
    
    describe('TokenTracker#peek', () => {
      it('returns the tracked down next token', () => {
        expect(tt.peek).toMatchObject({ type: 'eq', value: '=' });
      });

      it('returns `null` if the current token is the last since there are no more token in the next', () => {
        for (let i = 1; i < tokens.length; i += 1) tt.next();
        expect(tt.peek).toBeNull();
      });
    });
  });

  describe('Methods', () => {
    describe('TokenTracker#next', () => {
      it('tracks down the next token, returns the result and also updates the value of `current`', () => {
        expect(tt.current).toMatchObject({ type: 'ident', value: 'foo' });
        expect(tt.next()).toMatchObject({ type: 'eq', value: '=' });
        expect(tt.current).toMatchObject({ type: 'eq', value: '=' });
        expect(tt.next()).toMatchObject({ type: 'number', value: '1' });
        expect(tt.current).toMatchObject({ type: 'number', value: '1' });
        expect(tt.next()).toMatchObject({ type: 'plus', value: '+' });
        expect(tt.current).toMatchObject({ type: 'plus', value: '+' });
        expect(tt.next()).toMatchObject({ type: 'number', value: '2' });
        expect(tt.current).toMatchObject({ type: 'number', value: '2' });
      });
  
      it('throws error when no next token exist', () => {
        const count = tokens.length;
        for (let i = 1; i < count; i += 1) {
          expect(tt.next()).toBe(tokens[i]);
        }
  
        expect(() => tt.next()).toThrowError('TokenTracker: Out of bound, there are no tokens left for tracking');
        expect(tt.current).toBe(tokens[tokens.length - 1]);
      });
    });
  
    describe('TokenTracker#is', () => {
      it('checks the type of the current token and returns the boolean result', () => {
        expect(tt.is('number')).toBe(false);
        expect(tt.is('ident')).toBe(true);
        tt.next();
  
        expect(tt.is('eq')).toBe(true);
        tt.next();
  
        expect(tt.is('eq')).toBe(false);
        expect(tt.is('number')).toBe(true);
  
        tt.next();
        expect(tt.is('ident')).toBe(false);
        expect(tt.is('number')).toBe(false);
        expect(tt.is('plus')).toBe(true);
  
        tt.next();
        expect(tt.is('string')).toBe(false);
        expect(tt.is('number')).toBe(true);
      });
    });

    describe('TokenTracker#peekIs', () => {
      it('checks the type of the peeked token', () => {
        expect(tt.peekIs('ident')).toBe(false);
        expect(tt.peekIs('eq')).toBe(true);

        tt.next();
        expect(tt.peekIs('eq')).toBe(false);
        expect(tt.peekIs('number')).toBe(true);

        tt.next();
        expect(tt.peekIs('plus')).toBe(true);
        expect(tt.peekIs('number')).toBe(false);

        tt.next();
        expect(tt.peekIs('number')).toBe(true);
        expect(tt.peekIs('string')).toBe(false);
      });
    });

    describe('TokenTracker#hasNext', () => {
      it('checks the availability of the next token', () => {
        expect(tt.hasNext()).toBe(true);
        tt.next();
        expect(tt.hasNext()).toBe(true);
        tt.next();
        expect(tt.hasNext()).toBe(true);
        tt.next();
        expect(tt.hasNext()).toBe(true);
        tt.next();
        expect(tt.hasNext()).toBe(false);
      });
    });
  });
});
