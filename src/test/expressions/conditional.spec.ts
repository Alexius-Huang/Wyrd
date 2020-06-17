import { FundamentalCompileTest } from '../helper';

describe('Conditional Expressions', () => {
  describe('Arrow Expression', () => {
    FundamentalCompileTest('conditional/if-arrow-expression');
    FundamentalCompileTest('conditional/if-arrow-complex');
    FundamentalCompileTest('conditional/if-arrow-else-if-complex');
    FundamentalCompileTest('conditional/if-arrow-without-else-expression');
  });

  describe('If-Then Expression', () => {
    FundamentalCompileTest('conditional/if-then-expression');
    FundamentalCompileTest('conditional/if-then-complex');
    FundamentalCompileTest('conditional/if-then-else-if-complex');
    FundamentalCompileTest('conditional/if-then-without-else-expression');
  });

  describe('If-Block Expression', () => {
    FundamentalCompileTest('conditional/if-else-block-expression');
    FundamentalCompileTest('conditional/if-else-if-block-expression');
    FundamentalCompileTest('conditional/if-block-complex');
    FundamentalCompileTest('conditional/if-block-else-if-complex');
    FundamentalCompileTest('conditional/if-block-without-else-expression');
    FundamentalCompileTest('conditional/if-else-if-block-without-else-expression');
  });

  describe('If-Mixed Expression', () => {
    FundamentalCompileTest('conditional/if-mixed-expression');
    FundamentalCompileTest('conditional/if-mixed-without-else-expression');
  });

  describe('Conditional Scope', () => {
    FundamentalCompileTest('conditional/conditional-scope');
  });
});
