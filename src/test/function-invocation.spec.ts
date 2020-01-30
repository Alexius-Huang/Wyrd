import { FundamentalCompileTest } from './helper';

describe('Function Invocation', () => {
  describe('Basic Invocation', () => {
    FundamentalCompileTest('function-invocation/basic-invocation');
  });

  describe('With Parentheses Nested Parameters', () => {
    FundamentalCompileTest('function-invocation/with-parentheses');
  });

  describe('Nested Invocation', () => {
    describe('Basic Invocation', () => {
      FundamentalCompileTest('function-invocation/nested-invocation/basic-invocation');
    });

    describe('With Parentheses', () => {
      FundamentalCompileTest('function-invocation/nested-invocation/with-parentheses');
    });
  });
});
