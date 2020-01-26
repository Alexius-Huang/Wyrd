import { lex } from '../lexer/index';
import { parse } from '../parser/index';
import * as T from '../types';

describe('Assignment Expression', () => {
  describe('Reassignment', () => {
    it('Throws error when reassigning new value to a constant', () => {
      const program = `\
foo = 123
foo = 456
`;
      
      const tokens: Array<T.Token> = lex(program);
      expect(() => {
        parse(tokens);
      }).toThrow('Constant `foo` cannot be reassigned');      
    });
  });
});
