import { FundamentalCompileTest } from './helper';
import { compile } from '../index';

describe('Builtin Types', () => {
  describe('Primitives', () => {
    FundamentalCompileTest('builtin-types/primitives');
  });

  describe('Composite Data Structure', () => {
    describe('List', () => {
      FundamentalCompileTest('builtin-types/list');

      it('cannot contain mixed type of elements', () => {
        const program = `\n[1 2 "3" 4 5]`;
        const errorMsg = 'Parser: Expect List to contain of type `Num`, instead mixed with type `Str`';
        expect(() => compile(program)).toThrowError(errorMsg);
      });
    });
  });
});
