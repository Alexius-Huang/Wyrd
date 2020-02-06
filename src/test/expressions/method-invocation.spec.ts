import { FundamentalCompileTest } from '../helper';
import { compile } from '../..';

describe('Method Invocation', () => {
  describe('Direct Method Mapping', () => {
    FundamentalCompileTest('method-invocation/direct-method-mapping');

    it('throws error when passing unmatched pattern of input', () => {
      const program1 = `\n"Test".repeat("3")`;
      expect(() => compile(program1))
        .toThrowError('ParserError: Expect Str.repeat to receive input pattern of `Num`, instead got: `Str`');

      const program2 = `\n"Test".repeat(3, 3)`;
      expect(() => compile(program2))
        .toThrowError('ParserError: Expect Str.repeat to receive input pattern of `Num`, instead got: `Num.Num`');
      });
  });
});
