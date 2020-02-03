import { FundamentalCompileTest } from '../helper';

describe('Functions', () => {
  describe('Function Declaration', () => {
    describe('Function-Arrow Declaration', () => {
      FundamentalCompileTest('function-declaration/function-arrow-declaration');
    });
  
    describe('Function-Block Declaration', () => {
      FundamentalCompileTest('function-declaration/function-block-declaration');
    });
  });
  
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

    describe('Declare Before Invocation', () => {
      FundamentalCompileTest('function-invocation/declare-before-invoke');
    });
  });
});
