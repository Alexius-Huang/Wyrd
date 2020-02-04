import { FundamentalCompileTest } from '../helper';

describe('Arithmetic Expressions', () => {
  describe('Pure Arithmetics', () => {
    FundamentalCompileTest('arithmetics/pure-expression');
  });

  describe('With Prioritization', () => {
    FundamentalCompileTest('arithmetics/with-prioritization');
  });
});
