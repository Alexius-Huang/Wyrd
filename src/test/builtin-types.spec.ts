import { FundamentalCompileTest } from './helper';

describe('Builtin Types', () => {
  describe('Primitives', () => {
    FundamentalCompileTest('builtin-types/primitives');
  });

  describe('Composite Data Structure', () => {
    describe('List', () => {
      FundamentalCompileTest('builtin-types/list');
    });
  });
});
