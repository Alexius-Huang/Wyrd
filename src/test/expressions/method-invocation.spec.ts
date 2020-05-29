import { FundamentalCompileTest } from '../helper';
import { compile } from '../..';

describe('Method Invocation', () => {
  describe('Direct Method Mapping', () => {
    FundamentalCompileTest('method-invocation/direct-method-mapping');

    it('throws error when passing unmatched pattern of input', () => {
      const program1 = `\n"Test".repeat("3")`;
      expect(() => compile({ program: program1 }))
        .toThrowError('ParserError: Method for Str.repeat with input pattern `Str` doesn\'t exist');

      const program2 = `\n"Test".repeat(3, 3)`;
      expect(() => compile({ program: program2 }))
        .toThrowError('ParserError: Method for Str.repeat with input pattern `Num.Num` doesn\'t exist');
      });
  });

  describe('Expression then Invokes Method', () => {
    FundamentalCompileTest('method-invocation/expr-invoke-method');
  });

  describe('Chained Method Invocation', () => {
    FundamentalCompileTest('method-invocation/chained');
  });

  describe('Method Invocation as Parameters', () => {
    FundamentalCompileTest('method-invocation/as-params');
  });

  describe('Method Invocation mixed Binary Operation', () => {
    FundamentalCompileTest('method-invocation/with-binary-operation');
  });

  describe('Builtin-Type Method Invocation', () => {
    FundamentalCompileTest('method-invocation/builtin-type-invocation');

    it('throws error when passing no receiver parameter', () => {
      const program = `\nStr.upcase()`;
      expect(() => compile({ program }))
        .toThrowError('ParserError: Expect `Str.upcase` to have parameter as receiver of type `Str`');
    });

    it('throws error when passing wrong type of receiver paramter', () => {
      const program = `\nStr.upcase(123)`;
      expect(() => compile({ program }))
        .toThrowError('ParserError: Expect `Str.upcase` to have receiver of type `Str`, instead got `Num`');
    });
  });
});
