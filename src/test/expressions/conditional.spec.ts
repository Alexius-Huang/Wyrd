import { FundamentalCompileTest } from '../helper';

describe('Conditional Expressions', () => {
  describe('If-Arrow Expression', () => {
    FundamentalCompileTest('conditional/if-arrow-expression');
  });

  describe('If-Then Expression', () => {
    FundamentalCompileTest('conditional/if-then-expression');
  });

  describe('If-Mixed Expression', () => {
    FundamentalCompileTest('conditional/if-mixed-expression');
  });
});