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

  describe('If-Without-Else Expression', () => {
    FundamentalCompileTest('conditional/if-arrow-without-else-expression');
    FundamentalCompileTest('conditional/if-then-without-else-expression');
    FundamentalCompileTest('conditional/if-mixed-without-else-expression');
  });
});
