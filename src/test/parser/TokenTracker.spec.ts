import { TokenTracker } from '../../parser/utils';
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

    describe('TokenTracker#type', () => {
      it('returns the current token\'s property `type`', () => {
        const types = ['ident', 'eq', 'number', 'plus', 'number'];
        for (let i = 0; i < tokens.length - 1; i += 1) {
          expect(tt.type).toBe(types[i]);
          tt.next();
        }
        expect(tt.type).toBe(types[types.length - 1]);
      });
    });

    describe('TokenTracker#value', () => {
      it('returns the current token\'s property `value`', () => {
        const values = ['foo', '=', '1', '+', '2'];
        for (let i = 0; i < tokens.length - 1; i += 1) {
          expect(tt.value).toBe(values[i]);
          tt.next();
        }
        expect(tt.value).toBe(values[values.length - 1]);
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

    describe('TokenTracker#valueIs', () => {
      it('checks the value of the current token and returns the boolean result', () => {
        expect(tt.valueIs('1')).toBe(false);
        expect(tt.valueIs('foo')).toBe(true);

        tt.next();
        expect(tt.valueIs('=')).toBe(true);

        tt.next();
        expect(tt.valueIs('=')).toBe(false);
        expect(tt.valueIs('1')).toBe(true);
  
        tt.next();
        expect(tt.valueIs('foo')).toBe(false);
        expect(tt.valueIs('2')).toBe(false);
        expect(tt.valueIs('+')).toBe(true);
  
        tt.next();
        expect(tt.valueIs('foo')).toBe(false);
        expect(tt.valueIs('2')).toBe(true);
      });
    });

    describe('TokenTracker#peekValueIs', () => {
      it('checks the value of the peeked token and returns the boolean result', () => {
        expect(tt.peekValueIs('=')).toBe(true);
        expect(tt.peekValueIs('foo')).toBe(false);

        tt.next();
        expect(tt.peekValueIs('=')).toBe(false);
        expect(tt.peekValueIs('1')).toBe(true);

        tt.next();
        expect(tt.peekValueIs('+')).toBe(true);
        expect(tt.peekValueIs('1')).toBe(false);
  
        tt.next();
        expect(tt.peekValueIs('foo')).toBe(false);
        expect(tt.peekValueIs('2')).toBe(true);
        expect(tt.peekValueIs('+')).toBe(false);
  
        tt.next();
        expect(tt.peekValueIs('foo')).toBe(false);
        expect(tt.peekValueIs('2')).toBe(false);
      });
    });

    describe('TokenTracker#isNot', () => {
      it('checks the type of the current token and returns the boolean result', () => {
        expect(tt.isNot('number')).toBe(true);
        expect(tt.isNot('ident')).toBe(false);
        tt.next();
  
        expect(tt.isNot('eq')).toBe(false);
        tt.next();
  
        expect(tt.isNot('eq')).toBe(true);
        expect(tt.isNot('number')).toBe(false);
  
        tt.next();
        expect(tt.isNot('ident')).toBe(true);
        expect(tt.isNot('number')).toBe(true);
        expect(tt.isNot('plus')).toBe(false);
  
        tt.next();
        expect(tt.isNot('string')).toBe(true);
        expect(tt.isNot('number')).toBe(false);
      });
    });

    describe('TokenTracker#valueIsNot', () => {
      it('checks the value of the current token and returns the boolean result', () => {
        expect(tt.valueIsNot('1')).toBe(true);
        expect(tt.valueIsNot('foo')).toBe(false);

        tt.next();  
        expect(tt.valueIsNot('=')).toBe(false);

        tt.next();
        expect(tt.valueIsNot('=')).toBe(true);
        expect(tt.valueIsNot('1')).toBe(false);
  
        tt.next();
        expect(tt.valueIsNot('foo')).toBe(true);
        expect(tt.valueIsNot('2')).toBe(true);
        expect(tt.valueIsNot('+')).toBe(false);
  
        tt.next();
        expect(tt.valueIsNot('foo')).toBe(true);
        expect(tt.valueIsNot('2')).toBe(false);
      });
    });

    describe('TokenTracker#isOneOf', () => {
      it('checks the type of the current token is one of the specified input and returns the boolean result', () => {
        expect(tt.isOneOf('ident', 'number', 'eq')).toBe(true);
        expect(tt.isOneOf('number', 'plus', 'eq')).toBe(false);
      });
    });

    describe('TokenTracker#isNotOneOf', () => {
      it('checks the type of the current token is not one of the specified input and returns the boolean result', () => {
        expect(tt.isNotOneOf('ident', 'number', 'eq')).toBe(false);
        expect(tt.isNotOneOf('number', 'plus', 'eq')).toBe(true);
      });
    });

    describe('TokenTracker#valueIsOneOf', () => {
      it('checks the value of the current token is one of the specified input and returns the boolean result', () => {
        tt.next();
        expect(tt.valueIsOneOf('+', '-', '*', '/', '=')).toBe(true);
        expect(tt.valueIsOneOf('+', '-', '*', '/')).toBe(false);
      });
    });

    describe('TokenTracker#peekValueIsOneOf', () => {
      it('checks the value of the peeked token is one of the specified input and returns the boolean result', () => {
        expect(tt.peekValueIsOneOf('+', '-', '*', '/', '=')).toBe(true);
        expect(tt.peekValueIsOneOf('+', '-', '*', '/')).toBe(false);
      });
    });

    describe('TokenTracker#valueIsNotOneOf', () => {
      it('checks the value of the current token is not one of the specified input and returns the boolean result', () => {
        tt.next();
        expect(tt.valueIsNotOneOf('+', '-', '*', '/', '=')).toBe(false);
        expect(tt.valueIsNotOneOf('+', '-', '*', '/')).toBe(true);
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
