import { FundamentalCompileTest } from './helper';

describe('Function Invocation', () => {
  describe('Basic Invocation', () => {
    FundamentalCompileTest('function-invocation/basic-invocation');
  });

  describe('Nested Invocation', () => {
    FundamentalCompileTest('function-invocation/nested-invocation');
  });

  describe('With Prioritization', () => {
    FundamentalCompileTest('function-invocation/with-prioritization');
  });
});
