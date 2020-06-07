import { FundamentalCompileTest } from '../helper';
import { compile } from '../..';

describe('Method Declaration', () => {
  describe('Method-Arrow Declaration', () => {
    FundamentalCompileTest('method-declaration/method-arrow-declaration');
  });

  describe('Method-Block Declaration', () => {
    FundamentalCompileTest('method-declaration/method-block-declaration');
  });

  describe('Method Declaration Overloading', () => {
    FundamentalCompileTest('method-declaration/method-overloading');
  });

  describe('Method Declaration Overriding', () => {
    FundamentalCompileTest('method-declaration/method-overriding');
  });

  describe('No Argument Declaration', () => {
    it('throws error when no argument is declared with empty parentheses exist', () => {
      const program = `def Str.hello(): Str => "World"\n`;
      expect(() => compile({ program }))
        .toThrow('ParserError: Expect method `Str.hello` must declare at least one argument if parentheses exists, else remove the parenthese if no argument declared');
    });
  });
});
