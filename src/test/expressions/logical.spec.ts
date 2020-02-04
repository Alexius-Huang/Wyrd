import { FundamentalCompileTest } from '../helper';

describe('Logical Expressions', () => {
  describe('Pure Logics', () => {
    FundamentalCompileTest('logical/pure-logics');
  });

  describe('With Prioritization', () => {
    FundamentalCompileTest('logical/with-prioritization');
  });

  describe('Comparison', () => {
    FundamentalCompileTest('logical/comparison');
  });
});
